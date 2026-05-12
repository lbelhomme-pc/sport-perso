import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, ChevronDown, PlayCircle, Scale, Utensils } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { SessionMode } from "../components/session/SessionMode";
import { SectionCard } from "../components/ui/SectionCard";
import { PLANNED_TYPE_LABELS, SESSION_TYPE_LABELS } from "../data/defaults";
import { getDisplayedVersion } from "../data/trainingPlan";
import { useDailyContext } from "../hooks/useDailyContext";
import { useDashboard } from "../hooks/useDashboard";
import { useSessionChecklists } from "../hooks/useSessionChecklists";
import { useSessions } from "../hooks/useSessions";
import type { CompletedSession, EnergyLevel, PlannedSession, SleepQuality } from "../types";
import { formatLongDate } from "../utils/dates";
import { wantsNutrition, wantsSport } from "../utils/navigationFocus";
import { getProteinTarget } from "../utils/nutrition";
import { getCompletedForPlan } from "../utils/training";

const energyOptions: Array<{ id: EnergyLevel; label: string }> = [
  { id: "strong", label: "Faible" },
  { id: "normal", label: "Normale" },
  { id: "fatigue", label: "Élevée" }
];

const sleepOptions: Array<{ id: SleepQuality; label: string }> = [
  { id: "good", label: "Bon" },
  { id: "medium", label: "Moyen" },
  { id: "bad", label: "Mauvais" }
];

function remainingLabel(value: number) {
  if (value > 150) return `${Math.round(value)} kcal`;
  if (value >= -150) return "zone OK";
  return `+${Math.abs(Math.round(value))} kcal`;
}

function nutritionAdvice(type?: string, durationMin = 0, proteinRatio = 0, completed = false) {
  if (completed && type && type !== "recovery") {
    const label = SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS] ?? "sport";
    return `Tu as fait une séance ${label}. Priorité : protéines + glucides. Exemples : riz/poulet/légumes, sandwich thon + fruit, skyr + banane + céréales.`;
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
  energy,
  pain
}: {
  yesterdaySessions: CompletedSession[];
  todayPlanned?: PlannedSession;
  energy: EnergyLevel;
  pain?: boolean;
}) {
  const yesterdayDone = yesterdaySessions[0];
  const todayLabel = todayPlanned ? `${PLANNED_TYPE_LABELS[todayPlanned.type]} — ${todayPlanned.title}` : "récup active ou repos";

  if (yesterdayDone && todayPlanned) {
    return `Hier : ${yesterdayDone.title} validée. Aujourd'hui : ${todayLabel}. ${
      pain || energy === "fatigue" ? "Si jambes lourdes ou douleur, passe en version courte." : "Garde le plan, sans chercher le record à chaque ligne."
    }`;
  }

  if (yesterdayDone) {
    return `Hier : ${yesterdayDone.title} validée. Aujourd'hui : récupère proprement ou ajoute une séance libre si tu bouges vraiment.`;
  }

  if (todayPlanned) {
    return `Aujourd'hui : ${todayLabel}. Objectif : faire la bonne séance, pas prouver que tu es invincible un mardi soir.`;
  }

  return "Aujourd'hui : pas de séance obligatoire. Mobilité 8 min, marche ou vrai repos : les trois comptent si c'est cohérent.";
}

function recoveryHint(energy: EnergyLevel, sleep?: SleepQuality, pain?: boolean) {
  if (pain) return "Douleur signalée : baisse la version de séance et note précisément où ça gêne.";
  if (sleep === "bad") return "Sommeil mauvais : vise technique/propre, pas héroïque.";
  if (energy === "fatigue") return "Fatigue élevée : version courte ou récupération active.";
  return "Feu vert prudent : fais le plan, sans transformer la séance en test ego.";
}

function updateNumberInput(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export default function DashboardPage() {
  const dashboard = useDashboard();
  const focus = dashboard.settings.navigationFocus ?? "both";
  const showSport = wantsSport(focus);
  const showNutrition = wantsNutrition(focus);
  const { dailyContext, saveDailyContext } = useDailyContext(dashboard.today);
  const { sessions, saveSession, deletePlannedSessionCompletion } = useSessions();
  const { getCheckedItemIds, toggleChecklistItem } = useSessionChecklists();
  const [sessionMode, setSessionMode] = useState<PlannedSession | null>(null);
  const [loggingSession, setLoggingSession] = useState<PlannedSession | null>(null);
  const proteinTarget = getProteinTarget(dashboard.calculationWeight, dashboard.settings.proteinPerKg);
  const proteinRatio = proteinTarget > 0 ? dashboard.todayMealTotals.protein / proteinTarget : 1;
  const completedTodaySession = dashboard.todaySessions.find((session) => session.completed);
  const todayTypeLabel = dashboard.todayPlanned ? PLANNED_TYPE_LABELS[dashboard.todayPlanned.type] : "Repos / libre";
  const todayAction = dashboard.todayPlanned
    ? dashboard.todaySessions.some((session) => session.plannedSessionId === dashboard.todayPlanned?.id)
      ? "Voir / corriger la séance"
      : "Démarrer / enregistrer la séance"
    : "Ajouter une séance libre";
  const mealAdvice = nutritionAdvice(
    completedTodaySession?.type ?? dashboard.todayPlanned?.type,
    completedTodaySession?.durationMin ?? dashboard.todayPlanned?.durationMin,
    proteinRatio,
    Boolean(completedTodaySession)
  );
  const coachMessage = coachThread({
    yesterdaySessions: dashboard.yesterdaySessions,
    todayPlanned: dashboard.todayPlanned,
    energy: dailyContext.energyLevel,
    pain: dailyContext.pain
  });
  const nutritionReminders = [
    dashboard.todayMeals.length ? null : "Repas non saisi",
    dashboard.latestWeight ? null : "Poids absent",
    proteinRatio < 0.75 ? "Protéines basses" : null
  ].filter((item): item is string => Boolean(item));

  return (
    <>
      {showSport && sessionMode ? (
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
            <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.06em] text-petrol-800 sm:text-5xl">
              {todayTypeLabel} · {dashboard.todayPlanned?.durationMin ? `${dashboard.todayPlanned.durationMin} min` : "souple"}
            </h1>
            <p className="mt-2 text-xl font-black leading-tight text-petrol-800">
              {dashboard.todayPlanned?.title ?? "Aujourd'hui repos : mobilité 8 min si ça fait du bien"}
            </p>
          </div>
          <span className="chip bg-limeSoft text-petrol-900">Semaine {dashboard.currentWeek}</span>
        </div>

        <p className="mt-4 border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
          {coachMessage}
        </p>

        <details className="mt-4 border border-petrol-800/10 bg-white p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
            Version du jour
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </summary>
          <p className="mt-3 text-sm font-semibold leading-6 text-muted">
          {dashboard.todayPlanned
            ? getDisplayedVersion(dashboard.todayPlanned, dailyContext.energyLevel)
            : "Pas de séance prévue. Si tu bouges quand même, saisis une séance libre, sinon récupère vraiment."}
          </p>
        </details>

        <div className={`mt-5 grid gap-2 ${showNutrition ? "sm:grid-cols-[1fr_1fr_auto]" : "sm:grid-cols-[1fr_auto]"}`}>
          {dashboard.todayPlanned ? (
            <button
              type="button"
              className="action-button"
              onClick={() => {
                if (dashboard.todayPlanned) setSessionMode(dashboard.todayPlanned);
              }}
            >
              <PlayCircle className="h-5 w-5" /> {todayAction}
            </button>
          ) : (
            <Link to="/sessions" className="action-button">
              <PlayCircle className="h-5 w-5" /> {todayAction}
            </Link>
          )}
          {showNutrition ? (
            <Link to="/meals" className="ghost-button">
              <Utensils className="h-5 w-5" /> Ajouter repas
            </Link>
          ) : null}
          {dashboard.todayPlanned ? (
            <Link to="/planning" className="ghost-button">
              Voir détails
            </Link>
          ) : null}
        </div>
      </SectionCard>
      ) : (
      <SectionCard className="border-l-4 border-limeSoft p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Aujourd'hui</p>
            <p className="mt-1 text-sm font-bold text-muted">{formatLongDate(dashboard.today)}</p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.06em] text-petrol-800 sm:text-5xl">
              Nutrition et mouvement
            </h1>
            <p className="mt-2 text-xl font-black leading-tight text-petrol-800">
              Reste environ {remainingLabel(dashboard.remainingCalories)} sur ta journée.
            </p>
          </div>
          <span className="chip bg-limeSoft text-petrol-900">Sans sport dans le menu</span>
        </div>

        <p className="mt-4 border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
          Priorité : noter un repas simple, le poids si utile, et tes pas. Les séances et le programme ne sont pas affichés tant que le sport n'est pas choisi dans les réglages.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Link to="/meals" className="action-button">
            <Utensils className="h-5 w-5" /> Saisir un repas
          </Link>
          <Link to="/weight" className="ghost-button">
            <Scale className="h-5 w-5" /> Saisir le poids
          </Link>
          <Link to="/calendar" className="ghost-button">
            <CalendarCheck2 className="h-5 w-5" /> Calendrier
          </Link>
        </div>
      </SectionCard>
      )}

      {showSport && loggingSession ? (
        <SectionCard className="p-4 sm:p-6">
          <p className="eyebrow">Fin de séance</p>
          <h2 className="title-lg mt-2">Saisir le réel</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Garde juste l'essentiel si tu es cuit : durée, RPE, douleur, puis enregistrer.
          </p>
          <div className="mt-5">
            <SessionForm
              planned={loggingSession}
              onCancel={() => setLoggingSession(null)}
              onSubmit={(session) => {
                saveSession(session);
                setLoggingSession(null);
              }}
            />
          </div>
        </SectionCard>
      ) : null}

      {showNutrition ? (
      <SectionCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Nutrition utile</p>
            <h2 className="title-lg mt-2">Reste environ : {remainingLabel(dashboard.remainingCalories)}</h2>
          </div>
          <Link to="/meals" className="action-button">
            <Utensils className="h-5 w-5" /> Saisir mon repas
          </Link>
        </div>

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

        {nutritionReminders.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {nutritionReminders.map((reminder) => (
              <span key={reminder} className="chip bg-red-50 text-red-950">
                {reminder}
              </span>
            ))}
          </div>
        ) : null}
      </SectionCard>
      ) : null}

      <SectionCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Check rapide</p>
            <h2 className="title-lg mt-2">{showSport ? "Comment tu arrives aujourd'hui ?" : "Mouvement du jour"}</h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-muted">
            {showSport
              ? recoveryHint(dailyContext.energyLevel, dailyContext.sleepQuality, dailyContext.pain)
              : "Saisis juste les pas et les étages. Le reste du suivi sport reste caché."}
          </p>
        </div>

        <div className={`mt-5 grid gap-3 ${showSport ? "lg:grid-cols-4" : "sm:grid-cols-2"}`}>
          {showSport ? (
          <>
          <label className="field-label">
            Fatigue
            <select
              className="field"
              value={dailyContext.energyLevel}
              onChange={(event) =>
                saveDailyContext({
                  ...dailyContext,
                  date: dashboard.today,
                  energyLevel: event.target.value as EnergyLevel
                })
              }
            >
              {energyOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
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

          <label className="field-label">
            Douleur
            <select
              className="field"
              value={dailyContext.pain ? "yes" : "no"}
              onChange={(event) =>
                saveDailyContext({
                  ...dailyContext,
                  date: dashboard.today,
                  pain: event.target.value === "yes"
                })
              }
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          </>
          ) : null}

          <label className="field-label">
            Pas
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

          {!showSport ? (
            <label className="field-label">
              Étages
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
          ) : null}
        </div>
      </SectionCard>
    </>
  );
}
