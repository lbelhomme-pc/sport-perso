import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, ChevronDown, PlayCircle, Scale, Trash2, Utensils } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { ProgressionSnapshot } from "../components/progress/ProgressionSnapshot";
import { SessionMode } from "../components/session/SessionMode";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { SectionCard } from "../components/ui/SectionCard";
import { getDisplayedVersion } from "../data/trainingPlan";
import { useDailyContext } from "../hooks/useDailyContext";
import { useDashboard } from "../hooks/useDashboard";
import { useSessionChecklists } from "../hooks/useSessionChecklists";
import { useSessions } from "../hooks/useSessions";
import { useUserModules } from "../hooks/useUserModules";
import { getSportProgressionSummary } from "../services/progressionService";
import type { CompletedSession, EnergyLevel, PlannedSession, SleepQuality } from "../types";
import { formatLongDate } from "../utils/dates";
import { getProteinTarget } from "../utils/nutrition";
import { tracksNutritionNumbers } from "../utils/nutritionMode";
import { clampReadinessScore } from "../utils/readiness";
import { getCompletedTypeLabel, getPlannedTypeLabel, personalizePlannedSession } from "../utils/sportLabels";
import { getCompletedForPlan, getPlannedCompletion } from "../utils/training";

const sleepOptions: Array<{ id: SleepQuality; label: string }> = [
  { id: "good", label: "Bon" },
  { id: "medium", label: "Moyen" },
  { id: "bad", label: "Mauvais" }
];

const CHOOSE_SESSION_CHOICE = "__choose-session__";
const FREE_SESSION_CHOICE = "__free-session__";

function remainingLabel(value: number) {
  if (value > 150) return `${Math.round(value)} kcal`;
  if (value >= -150) return "zone OK";
  return `+${Math.abs(Math.round(value))} kcal`;
}

function nutritionAdvice(type?: string, durationMin = 0, proteinRatio = 0, completed = false, typeLabel = "sport") {
  if (completed && type && type !== "recovery") {
    return `Tu as fait une séance ${typeLabel}. Priorité : protéines + glucides. Exemples : riz/poulet/légumes, sandwich thon + fruit, skyr + banane + céréales.`;
  }

  if (proteinRatio < 0.55) return "Ajoute un repas protéiné. Si séance ce soir : protéines + glucides simples.";
  if (!type || type === "rest") return "Repos : protéines, légumes, eau. Pas besoin de forcer les glucides.";
  if (type === "badminton" || type === "hyrox" || type === "hybrid" || durationMin >= 75) {
    return "Séance exigeante : glucides avant, protéines + glucides après. Eau + sel si tu transpires beaucoup.";
  }
  return "Repas normal : protéines + glucides propres. Garde quelque chose de digeste avant séance.";
}

function coachThread({
  yesterdaySessions,
  todayPlanned,
  todayTypeLabel,
  energy,
  pain,
  fatigueMorning
}: {
  yesterdaySessions: CompletedSession[];
  todayPlanned?: PlannedSession;
  todayTypeLabel?: string;
  energy: EnergyLevel;
  pain?: boolean;
  fatigueMorning?: number;
}) {
  const yesterdayDone = yesterdaySessions[0];
  const todayLabel = todayPlanned ? `${todayTypeLabel ?? "Séance"} - ${todayPlanned.title}` : "récup active ou repos";
  const fragileMorning = pain && (fatigueMorning ?? 0) >= 7;

  if (yesterdayDone && todayPlanned) {
    return `Hier : ${yesterdayDone.title} validée. Aujourd'hui : ${todayLabel}. ${
      fragileMorning
        ? "Fatigue élevée + douleur signalée : séance courte recommandée aujourd'hui."
        : pain || energy === "fatigue" || (fatigueMorning ?? 0) >= 7
          ? "Si jambes lourdes, fatigue haute ou douleur, passe en version courte."
        : "Garde le plan, sans chercher le record à chaque ligne."
    }`;
  }

  if (yesterdayDone) {
    return `Hier : ${yesterdayDone.title} validée. Aujourd'hui : récupère proprement ou ajoute une séance libre si tu bouges vraiment.`;
  }

  if (todayPlanned) {
    return `Aujourd'hui : ${todayLabel}. Objectif : faire la bonne séance, proprement, sans forcer inutilement.`;
  }

  return "Aujourd'hui : pas de séance obligatoire. Mobilité 8 min, marche ou repos complet : les trois peuvent être utiles.";
}

function recoveryHint(energy: EnergyLevel, sleep?: SleepQuality, pain?: boolean, fatigueMorning?: number, painMorning?: number) {
  if ((fatigueMorning ?? 0) >= 7 && ((painMorning ?? 0) >= 4 || pain)) return "Fatigue élevée + douleur signalée : séance courte recommandée aujourd'hui.";
  if ((painMorning ?? 0) >= 4 || pain) return `Douleur au réveil ${painMorning ?? "signalée"}/10 : baisse la version et note précisément où ça gêne.`;
  if (sleep === "bad") return "Sommeil mauvais : vise propre et facile, sans forcer.";
  if ((fatigueMorning ?? 0) >= 7 || energy === "fatigue") return `Fatigue au réveil ${fatigueMorning ?? "élevée"}/10 : version courte ou récupération active.`;
  return "Feu vert prudent : fais le plan, proprement.";
}

function updateNumberInput(value: string) {
  return Number(value.replace(/\D/g, ""));
}

function updateScoreInput(value: string) {
  return clampReadinessScore(Number(value.replace(/\D/g, "")));
}

export default function DashboardPage() {
  const dashboard = useDashboard();
  const { isEnabled } = useUserModules();
  const showTraining = isEnabled("training");
  const showSessions = isEnabled("sessions");
  const showSport = showTraining || showSessions;
  const showNutrition = isEnabled("nutrition");
  const showNutritionNumbers = showNutrition && tracksNutritionNumbers(dashboard.settings);
  const showWeight = isEnabled("weight");
  const showCalendar = isEnabled("calendar");
  const showRecovery = isEnabled("recovery");
  const { dailyContext, saveDailyContext } = useDailyContext(dashboard.today);
  const { sessions, saveSession, deleteSession, deletePlannedSessionCompletion } = useSessions();
  const { getCheckedItemIds, toggleChecklistItem } = useSessionChecklists();
  const [sessionMode, setSessionMode] = useState<PlannedSession | null>(null);
  const [loggingSession, setLoggingSession] = useState<PlannedSession | null>(null);
  const weekSessionOptions = showTraining
    ? dashboard.plannedWeek
        .filter((session) => session.type !== "rest")
        .map((session) => personalizePlannedSession(session, dashboard.settings))
    : [];
  const chosenSessionId = dailyContext.selectedPlannedSessionId;
  const chosenWeekSession =
    chosenSessionId && chosenSessionId !== FREE_SESSION_CHOICE
      ? weekSessionOptions.find((session) => session.id === chosenSessionId)
      : undefined;
  const todayPlanned = chosenWeekSession;
  const selectedPlanChoice = chosenSessionId ?? CHOOSE_SESSION_CHOICE;
  const waitingForSessionChoice = selectedPlanChoice === CHOOSE_SESSION_CHOICE;
  const weekProgramCompletion = getPlannedCompletion(weekSessionOptions, dashboard.allSessions);
  const proteinTarget = getProteinTarget(dashboard.calculationWeight, dashboard.settings.proteinPerKg);
  const proteinRatio = proteinTarget > 0 ? dashboard.todayMealTotals.protein / proteinTarget : 1;
  const completedTodaySession = dashboard.todaySessions.find((session) => session.completed);
  const completedPlannedSession = todayPlanned ? getCompletedForPlan(sessions, todayPlanned.id) : undefined;
  const todayTypeLabel = todayPlanned
    ? getPlannedTypeLabel(todayPlanned.type, dashboard.settings)
    : waitingForSessionChoice
      ? "Programme semaine"
      : showSessions
        ? "Séance libre"
        : "Suivi du jour";
  const todayAction = todayPlanned
    ? completedPlannedSession
      ? "Corriger la séance"
      : "Démarrer séance"
    : waitingForSessionChoice
      ? "Choisir une séance"
      : showSessions
        ? "Ajouter activité"
        : "Personnaliser";
  const nutritionSessionLabel = completedTodaySession
    ? getCompletedTypeLabel(completedTodaySession.type, dashboard.settings)
    : todayPlanned
      ? todayTypeLabel
      : "sport";
  const mealAdvice = nutritionAdvice(
    completedTodaySession?.type ?? todayPlanned?.type,
    completedTodaySession?.durationMin ?? todayPlanned?.durationMin,
    proteinRatio,
    Boolean(completedTodaySession),
    nutritionSessionLabel
  );
  const coachMessage = waitingForSessionChoice
    ? "Programme de la semaine : choisis la séance la plus réaliste aujourd'hui. Si les contraintes changent, sélectionne une activité libre et garde le fil sans te battre avec le calendrier."
    : coachThread({
        yesterdaySessions: dashboard.yesterdaySessions,
        todayPlanned,
        todayTypeLabel,
        energy: dailyContext.energyLevel,
        pain: dailyContext.pain,
        fatigueMorning: dailyContext.fatigueMorning
      });
  const progressionSummary = getSportProgressionSummary({
    sessions: dashboard.allSessions,
    dailyContexts: dashboard.dailyContexts,
    today: dashboard.today
  });
  const nutritionReminders = showNutritionNumbers
    ? [
        dashboard.todayMeals.length ? null : "Repas non saisi",
        dashboard.latestWeight ? null : "Poids absent",
        proteinRatio < 0.75 ? "Protéines basses" : null
      ].filter((item): item is string => Boolean(item))
    : [];
  const todayLoggedSessions = dashboard.todaySessions.filter((session) => session.completed);
  const movementInputs = showCalendar ? (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <label className="field-label">
        Pas aujourd'hui
        <input
          className="field"
          inputMode="numeric"
          pattern="[0-9]*"
          value={dailyContext.steps ? String(dailyContext.steps) : ""}
          onChange={(event) =>
            saveDailyContext({
              ...dailyContext,
              date: dashboard.today,
              steps: updateNumberInput(event.target.value)
            })
          }
          placeholder="Ex : 8500"
        />
      </label>

      <label className="field-label">
        Étages aujourd'hui
        <input
          className="field"
          inputMode="numeric"
          pattern="[0-9]*"
          value={dailyContext.floors ? String(dailyContext.floors) : ""}
          onChange={(event) =>
            saveDailyContext({
              ...dailyContext,
              date: dashboard.today,
              floors: updateNumberInput(event.target.value)
            })
          }
          placeholder="Ex : 8"
        />
      </label>
    </div>
  ) : null;

  return (
    <>
      {showTraining && sessionMode ? (
        <SessionMode
          session={sessionMode}
          energy={dailyContext.energyLevel}
          checkedItemIds={getCheckedItemIds(sessionMode.id)}
          completed={Boolean(getCompletedForPlan(sessions, sessionMode.id))}
          onToggle={(itemId, checked) => toggleChecklistItem(sessionMode.id, itemId, checked)}
          onClose={() => setSessionMode(null)}
          onFinish={() => {
            setLoggingSession(sessionMode);
            setSessionMode(null);
          }}
          onUndo={() => deletePlannedSessionCompletion(sessionMode.id)}
        />
      ) : null}

      {showSport ? (
        <SectionCard className="border-l-4 border-limeSoft p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Aujourd'hui</p>
              <p className="mt-1 text-sm font-bold text-muted">{formatLongDate(dashboard.today)}</p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-700">
                {todayTypeLabel}{todayPlanned?.durationMin ? ` · ${todayPlanned.durationMin} min` : ""}
              </p>
              <h1 className="mt-2 font-display text-3xl font-black leading-tight tracking-[-0.06em] text-petrol-800 sm:text-5xl">
                {todayPlanned?.title ?? (waitingForSessionChoice ? "Choisis ta séance du jour" : "Activité libre aujourd'hui")}
              </h1>
            </div>
            <span className="chip bg-limeSoft text-petrol-900">Semaine {dashboard.currentWeek}</span>
          </div>

          <p className="mt-4 border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
            {coachMessage}
          </p>

          {showTraining && weekSessionOptions.length ? (
            <label className="field-label mt-4">
              Séance choisie aujourd'hui
              <select
                className="field"
                value={selectedPlanChoice}
                onChange={(event) =>
                  saveDailyContext({
                    ...dailyContext,
                    date: dashboard.today,
                    selectedPlannedSessionId: event.target.value === CHOOSE_SESSION_CHOICE ? undefined : event.target.value
                  })
                }
              >
                <option value={CHOOSE_SESSION_CHOICE}>Choisir une séance de la semaine</option>
                <option value={FREE_SESSION_CHOICE}>Autre activité / séance libre</option>
                {weekSessionOptions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {getPlannedTypeLabel(session.type, dashboard.settings)} - {session.title} - {session.durationMin} min
                  </option>
                ))}
              </select>
              <span className="text-[0.72rem] font-bold normal-case leading-5 tracking-normal text-muted">
                Choisis dans les séances de la semaine selon tes contraintes du jour. Le planning garde la structure, toi tu gardes la liberté.
              </span>
            </label>
          ) : null}

          <div className={`mt-5 grid gap-2 ${showNutrition ? "sm:grid-cols-[1fr_1fr_auto]" : "sm:grid-cols-[1fr_auto]"}`}>
            {todayPlanned ? (
              <button type="button" className="action-button" onClick={() => setSessionMode(todayPlanned)}>
                <PlayCircle className="h-5 w-5" /> {todayAction}
              </button>
            ) : waitingForSessionChoice ? (
              <button type="button" className="action-button opacity-70" disabled>
                <PlayCircle className="h-5 w-5" /> {todayAction}
              </button>
            ) : (
              <Link to={showSessions ? `/sessions?date=${dashboard.today}&add=1` : "/settings"} className="action-button">
                <PlayCircle className="h-5 w-5" /> {todayAction}
              </Link>
            )}
            {showNutrition ? (
              <Link to={`/meals?date=${dashboard.today}&add=1`} className="ghost-button">
                <Utensils className="h-5 w-5" /> Ajouter repas
              </Link>
            ) : null}
            {todayPlanned ? (
              <Link to={`/planning?week=${dashboard.currentWeek}#${todayPlanned.id}`} className="ghost-button">
                Voir détails
              </Link>
            ) : null}
          </div>

          {weekProgramCompletion.planned ? (
            <div className="mt-4 border border-petrol-800/10 bg-white p-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Programme semaine</p>
                <p className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">
                  {weekProgramCompletion.completed}/{weekProgramCompletion.planned} · {weekProgramCompletion.ratio} %
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden bg-mist">
                <div className="h-full bg-limeSoft" style={{ width: `${weekProgramCompletion.ratio}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold leading-6 text-muted">
                Compte les séances prévues de la semaine validées, même si tu les fais un autre jour.
              </p>
            </div>
          ) : null}

          {showRecovery ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <label className="field-label">
                Fatigue /10
                <input
                  className="field"
                  type="number"
                  min="0"
                  max="10"
                  inputMode="numeric"
                  value={dailyContext.fatigueMorning ?? 5}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      fatigueMorning: updateScoreInput(event.target.value)
                    })
                  }
                />
              </label>
              <label className="field-label">
                Douleur /10
                <input
                  className="field"
                  type="number"
                  min="0"
                  max="10"
                  inputMode="numeric"
                  value={dailyContext.painMorning ?? 0}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      painMorning: updateScoreInput(event.target.value)
                    })
                  }
                />
              </label>
              <label className="field-label">
                Sommeil
                <select
                  className="field"
                  value={dailyContext.sleepQuality ?? "medium"}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      sleepQuality: event.target.value as SleepQuality
                    })
                  }
                >
                  {sleepOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {movementInputs}

          {todayPlanned ? (
            <details className="mt-4 border border-petrol-800/10 bg-white p-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
                Voir la version du jour
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                {getDisplayedVersion(todayPlanned, dailyContext.energyLevel)}
              </p>
            </details>
          ) : null}

          {todayLoggedSessions.length ? (
            <div className="mt-4 grid gap-2 border border-petrol-800/10 bg-white p-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Séances enregistrées aujourd'hui</p>
              {todayLoggedSessions.map((session) => (
                <div key={session.id} className="flex flex-col gap-2 border-l-4 border-limeSoft bg-mist/45 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-petrol-800">{session.title}</p>
                    <p className="text-sm font-bold text-muted">
                      {getCompletedTypeLabel(session.type, dashboard.settings)} · {session.durationMin} min
                      {session.caloriesBurned ? ` · ${session.caloriesBurned} kcal` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ghost-button justify-center"
                    onClick={() => {
                      if (window.confirm("Supprimer cette séance enregistrée ?")) deleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4 border border-petrol-800/10 bg-white p-3 text-sm font-bold leading-6 text-ink">
            Tendance utile : {progressionSummary.coachingMessage}
          </div>
        </SectionCard>
      ) : (
        <SectionCard className="border-l-4 border-limeSoft p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Aujourd'hui</p>
              <p className="mt-1 text-sm font-bold text-muted">{formatLongDate(dashboard.today)}</p>
              <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.06em] text-petrol-800 sm:text-5xl">
                {showNutrition ? "Repas et mouvement" : showRecovery ? "Récupération et habitudes" : "Ton espace du jour"}
              </h1>
              <p className="mt-2 text-xl font-black leading-tight text-petrol-800">
                {showNutritionNumbers
                  ? `Reste environ ${remainingLabel(dashboard.remainingCalories)} sur ta journée.`
                  : showNutrition
                    ? "Note simplement tes repas, sans calorie ni macro."
                  : showRecovery
                    ? recoveryHint(dailyContext.energyLevel, dailyContext.sleepQuality, dailyContext.pain, dailyContext.fatigueMorning, dailyContext.painMorning)
                    : "Choisis une action rapide ou ajuste tes modules dans le profil."}
              </p>
            </div>
            <span className="chip bg-limeSoft text-petrol-900">Menu personnalisé</span>
          </div>

          <p className="mt-4 border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
            {showNutritionNumbers
              ? "Priorité : noter un repas simple, le poids si utile, et tes pas. Les séances et le programme restent cachés tant que le sport n'est pas choisi dans les réglages."
              : showNutrition
                ? "Mode nutrition sans calories : l'objectif est la régularité des repas et les notes utiles, pas les chiffres."
              : "Les blocs désactivés ne sont pas affichés ici. Tu peux les réactiver plus tard dans Profil sans perdre tes données."}
          </p>

          {showRecovery ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <label className="field-label">
                Fatigue /10
                <input
                  className="field"
                  type="number"
                  min="0"
                  max="10"
                  inputMode="numeric"
                  value={dailyContext.fatigueMorning ?? 5}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      fatigueMorning: updateScoreInput(event.target.value)
                    })
                  }
                />
              </label>
              <label className="field-label">
                Douleur /10
                <input
                  className="field"
                  type="number"
                  min="0"
                  max="10"
                  inputMode="numeric"
                  value={dailyContext.painMorning ?? 0}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      painMorning: updateScoreInput(event.target.value)
                    })
                  }
                />
              </label>
              <label className="field-label">
                Sommeil
                <select
                  className="field"
                  value={dailyContext.sleepQuality ?? "medium"}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: dashboard.today,
                      sleepQuality: event.target.value as SleepQuality
                    })
                  }
                >
                  {sleepOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {movementInputs}

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {showNutrition ? (
              <Link to={`/meals?date=${dashboard.today}&add=1`} className="action-button">
                <Utensils className="h-5 w-5" /> Saisir un repas
              </Link>
            ) : null}
            {showWeight ? (
              <Link to="/weight?add=1" className={showNutrition ? "ghost-button" : "action-button"}>
                <Scale className="h-5 w-5" /> Saisir le poids
              </Link>
            ) : null}
            {showCalendar ? (
              <Link to="/calendar" className={showNutrition || showWeight ? "ghost-button" : "action-button"}>
                <CalendarCheck2 className="h-5 w-5" /> Calendrier
              </Link>
            ) : null}
            {!showNutrition && !showWeight && !showCalendar ? (
              <Link to="/settings" className="action-button">
                Personnaliser mes modules
              </Link>
            ) : null}
          </div>
        </SectionCard>
      )}

      {showTraining && loggingSession ? (
        <SectionCard className="p-4 sm:p-6">
          <p className="eyebrow">Fin de séance</p>
          <h2 className="title-lg mt-2">Saisir le réel</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Garde juste l'essentiel si tu es cuit : durée, RPE, douleur, puis enregistrer.
          </p>
          <div className="mt-5">
            <SessionForm
              planned={loggingSession}
              initial={getCompletedForPlan(sessions, loggingSession.id) ?? { date: dashboard.today }}
              onCancel={() => setLoggingSession(null)}
              onSubmit={(session) => {
                saveSession(session);
                setLoggingSession(null);
              }}
            />
          </div>
        </SectionCard>
      ) : null}

      {showSport ? (
        <CollapsibleSectionCard
          eyebrow="Détail progression"
          title="Progression"
          summary="Les détails restent ici pour garder l'accueil centré sur l'action du jour."
        >
          <ProgressionSnapshot summary={progressionSummary} compact />
        </CollapsibleSectionCard>
      ) : null}

      {showNutrition ? (
        <CollapsibleSectionCard
          eyebrow="Détail nutrition"
          title={showNutritionNumbers ? `Reste environ : ${remainingLabel(dashboard.remainingCalories)}` : "Journal repas sans calories"}
          summary="À ouvrir quand tu veux décider quoi manger ou vérifier les protéines."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold leading-6 text-muted">
                {showNutritionNumbers ? "Objectif : comprendre la prochaine action, pas lire un tableau compliqué." : "Mode simple : repas et sensations, sans chiffres imposés."}
              </p>
            </div>
            <Link to={`/meals?date=${dashboard.today}&add=1`} className="action-button">
              <Utensils className="h-5 w-5" /> Saisir mon repas
            </Link>
          </div>

          {showNutritionNumbers ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="border border-petrol-800/10 bg-white p-4">
              <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">Protéines</p>
              <p className="mt-1 font-display text-3xl font-black tracking-[-0.05em] text-petrol-800">
                {Math.round(dashboard.todayMealTotals.protein)} / {proteinTarget} g
              </p>
            </div>
            <div className="border-l-4 border-limeSoft bg-mist/50 p-4">
              <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">Conseil</p>
              <p className="mt-2 text-base font-semibold leading-7 text-ink">{mealAdvice}</p>
            </div>
          </div>
          ) : (
            <p className="mt-4 border-l-4 border-limeSoft bg-mist/50 p-4 text-sm font-semibold leading-6 text-ink">
              Note ce que tu as mangé et les sensations utiles. Si tu veux les calories/macros, active le mode complet dans Profil.
            </p>
          )}

          {nutritionReminders.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {nutritionReminders.map((reminder) => (
                <span key={reminder} className="chip bg-red-50 text-red-950">
                  {reminder}
                </span>
              ))}
            </div>
          ) : null}
        </CollapsibleSectionCard>
      ) : null}

    </>
  );
}
