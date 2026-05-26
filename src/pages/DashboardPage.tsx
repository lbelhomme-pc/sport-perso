import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, ChevronDown, PlayCircle, Scale, Trash2, Utensils } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { ProgressionSnapshot } from "../components/progress/ProgressionSnapshot";
import { SessionMode } from "../components/session/SessionMode";
import { ActionPanel } from "../components/ui/ActionPanel";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { GaugeBar } from "../components/ui/GaugeBar";
import { MetricTile } from "../components/ui/MetricTile";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getDisplayedVersion } from "../data/trainingPlan";
import { useDailyContext } from "../hooks/useDailyContext";
import { useDashboard } from "../hooks/useDashboard";
import { useSessionChecklists } from "../hooks/useSessionChecklists";
import { useSessions } from "../hooks/useSessions";
import { useUserModules } from "../hooks/useUserModules";
import { getSportProgressionSummary } from "../services/progressionService";
import type { EnergyLevel, PlannedSession, Settings, SleepQuality } from "../types";
import { formatLongDate } from "../utils/dates";
import { getProteinTarget } from "../utils/nutrition";
import { tracksNutritionNumbers } from "../utils/nutritionMode";
import { parseOptionalReadinessScore } from "../utils/readiness";
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
    return `Séance ${typeLabel} validée : vise protéines + glucides simples au repas suivant.`;
  }

  if (proteinRatio < 0.55) return "Ajoute une source de protéines. Si séance ce soir, garde aussi des glucides digestes.";
  if (!type || type === "rest") return "Repos : protéines, légumes, eau. Pas besoin de forcer les glucides.";
  if (type === "badminton" || type === "hyrox" || type === "hybrid" || durationMin >= 75) {
    return "Séance exigeante : glucides avant, protéines + glucides après, eau régulière.";
  }
  return "Repas normal : protéines + glucides propres. Garde quelque chose de digeste avant séance.";
}

function recoveryHint(energy: EnergyLevel, sleep?: SleepQuality, pain?: boolean, fatigueMorning?: number, painMorning?: number) {
  if ((fatigueMorning ?? 0) >= 7 && ((painMorning ?? 0) >= 4 || pain)) return "Allège aujourd'hui : fatigue haute et douleur signalée.";
  if ((painMorning ?? 0) >= 4 || pain) return `Douleur ${painMorning ?? "signalée"}/10 : baisse la charge et note ce qui gêne.`;
  if (sleep === "bad") return "Sommeil mauvais : vise propre, court, sans record.";
  if ((fatigueMorning ?? 0) >= 7 || energy === "fatigue") return `Fatigue ${fatigueMorning ?? "élevée"}/10 : version courte ou récupération active.`;
  return "Feu vert prudent : fais simple et propre.";
}

function updateNumberInput(value: string) {
  return Number(value.replace(/\D/g, ""));
}

function updateScoreInput(value: string) {
  return parseOptionalReadinessScore(value);
}

function gaugeTone(value: number, warningAt: number, dangerAt: number) {
  if (value >= dangerAt) return "danger" as const;
  if (value >= warningAt) return "warning" as const;
  return "lime" as const;
}

function recoveryScore(energy: EnergyLevel, sleep?: SleepQuality, pain?: boolean, fatigueMorning = 0, painMorning = 0) {
  const sleepPenalty = sleep === "bad" ? 20 : sleep === "medium" ? 8 : 0;
  const energyPenalty = energy === "fatigue" ? 12 : energy === "strong" ? -6 : 0;
  const painPenalty = pain ? 12 : 0;
  return Math.max(0, Math.min(100, 100 - fatigueMorning * 7 - painMorning * 8 - sleepPenalty - energyPenalty - painPenalty));
}

function recoveryLabel(score: number) {
  if (score < 45) return "allège";
  if (score < 70) return "modéré";
  return "OK";
}

function weekdayInitial(date: string) {
  const labels = ["D", "L", "M", "M", "J", "V", "S"];
  return labels[new Date(`${date}T00:00:00`).getDay()];
}

function WeekTrackerCard({
  days,
  completed,
  planned,
  volumeMin,
  status,
  progress
}: {
  days: Array<{ date: string; planned: number; done: number; volume: number }>;
  completed: number;
  planned: number;
  volumeMin: number;
  status: "léger" | "stable" | "chargé";
  progress: number;
}) {
  const maxVolume = Math.max(...days.map((day) => day.volume || day.planned * 18), 1);
  const statusTone = status === "chargé" ? "warning" : status === "léger" ? "info" : "lime";

  return (
    <article className="theme-stat-card rounded-panel border p-4 shadow-panel sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="stat-muted text-xs font-black uppercase tracking-[0.12em]">Semaine</p>
          <p className="mt-1 font-display text-3xl font-black tracking-[-0.06em]">{completed}/{planned || "—"}</p>
        </div>
        <StatusBadge tone={statusTone}>{status}</StatusBadge>
      </div>

      <div className="mt-4 grid h-24 grid-cols-7 items-end gap-1.5" aria-hidden="true">
        {days.map((day) => {
          const height = day.volume > 0 ? Math.max(14, (day.volume / maxVolume) * 100) : day.planned ? 12 : 5;

          return (
            <div key={day.date} className="flex h-full min-w-0 flex-col justify-end gap-1">
              <span
                className={`mx-auto w-full rounded-full transition-[height,background-color,opacity] duration-200 ease-out motion-reduce:transition-none ${
                  day.done ? "bg-limeSoft" : day.planned ? "bg-petrol-800/35" : "bg-petrol-800/10"
                }`}
                style={{ height: `${height}%` }}
              />
              <span className="stat-soft text-center text-[0.64rem] font-black uppercase leading-none">{weekdayInitial(day.date)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-card bg-white/65 p-2">
          <p className="stat-soft text-[0.62rem] font-black uppercase tracking-[0.06em]">Actifs</p>
          <p className="stat-accent mt-1 font-display text-xl font-black">{days.filter((day) => day.done > 0).length}</p>
        </div>
        <div className="rounded-card bg-white/65 p-2">
          <p className="stat-soft text-[0.62rem] font-black uppercase tracking-[0.06em]">Volume</p>
          <p className="stat-accent mt-1 font-display text-xl font-black">{volumeMin}m</p>
        </div>
        <div className="rounded-card bg-white/65 p-2">
          <p className="stat-soft text-[0.62rem] font-black uppercase tracking-[0.06em]">Plan</p>
          <p className="stat-accent mt-1 font-display text-xl font-black">{progress}%</p>
        </div>
      </div>
    </article>
  );
}

function SessionChoiceCards({
  sessions,
  selectedValue,
  settings,
  onSelect
}: {
  sessions: PlannedSession[];
  selectedValue: string;
  settings: Settings;
  onSelect: (sessionId: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="field-label">Séance choisie</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={`interactive-card min-h-16 rounded-card border p-3 text-left shadow-sm transition ${
            selectedValue === FREE_SESSION_CHOICE
              ? "border-petrol-800 bg-petrol-800 text-white"
              : "border-petrol-800/10 bg-white/80 text-petrol-800 hover:bg-white"
          }`}
          aria-pressed={selectedValue === FREE_SESSION_CHOICE}
          onClick={() => onSelect(FREE_SESSION_CHOICE)}
        >
          <span className="block text-sm font-black">Autre activité</span>
          <span className={`mt-1 block text-xs font-bold ${selectedValue === FREE_SESSION_CHOICE ? "text-white/75" : "text-muted"}`}>
            Saisie libre
          </span>
        </button>
        {sessions.map((session) => {
          const selected = selectedValue === session.id;

          return (
            <button
              key={session.id}
              type="button"
              className={`interactive-card min-h-16 rounded-card border p-3 text-left shadow-sm transition ${
                selected ? "border-petrol-800 bg-petrol-800 text-white" : "border-petrol-800/10 bg-white/80 text-petrol-800 hover:bg-white"
              }`}
              aria-pressed={selected}
              onClick={() => onSelect(session.id)}
            >
              <span className="block text-sm font-black">{session.title}</span>
              <span className={`mt-1 block text-xs font-bold ${selected ? "text-white/75" : "text-muted"}`}>
                {getPlannedTypeLabel(session.type, settings)} · {session.durationMin} min
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
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
  const hasProgramChoices = showTraining && weekSessionOptions.length > 0;
  const waitingForSessionChoice = hasProgramChoices && selectedPlanChoice === CHOOSE_SESSION_CHOICE;
  const weekProgramCompletion = getPlannedCompletion(weekSessionOptions, dashboard.allSessions);
  const proteinTarget = getProteinTarget(dashboard.calculationWeight, dashboard.settings.proteinPerKg);
  const proteinRatio = proteinTarget > 0 ? dashboard.todayMealTotals.protein / proteinTarget : 1;
  const completedTodaySession = dashboard.todaySessions.find((session) => session.completed);
  const completedPlannedSession = todayPlanned ? getCompletedForPlan(sessions, todayPlanned) : undefined;
  const todayTypeLabel = todayPlanned
    ? getPlannedTypeLabel(todayPlanned.type, dashboard.settings)
    : waitingForSessionChoice
      ? "Séance à choisir"
      : showSessions
        ? "Activité libre"
        : "Suivi du jour";
  const primaryActionLabel = todayPlanned
    ? completedPlannedSession
      ? "Corriger la séance"
      : "Démarrer la séance"
    : waitingForSessionChoice
      ? "Choisir une séance"
      : showSessions
        ? "Démarrer l'activité"
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
  const dailyHint = recoveryHint(
    dailyContext.energyLevel,
    dailyContext.sleepQuality,
    dailyContext.pain,
    dailyContext.fatigueMorning,
    dailyContext.painMorning
  );
  const fatigueValue = dailyContext.fatigueMorning ?? 0;
  const painValue = dailyContext.painMorning ?? 0;
  const recoveryValue = recoveryScore(dailyContext.energyLevel, dailyContext.sleepQuality, dailyContext.pain, fatigueValue, painValue);
  const weekVolumeDone = weekSessionOptions.reduce((total, session) => {
    const completedSession = getCompletedForPlan(sessions, session);
    return completedSession ? total + completedSession.durationMin : total;
  }, 0);
  const weekVolumePlanned = weekSessionOptions.reduce((total, session) => total + session.durationMin, 0);
  const weekLoadStatus: "léger" | "stable" | "chargé" =
    weekVolumePlanned > 0 && weekVolumeDone > weekVolumePlanned * 1.1
      ? "chargé"
      : weekProgramCompletion.ratio < 45
        ? "léger"
        : "stable";
  const weekTrackerDays = weekSessionOptions.reduce<Array<{ date: string; planned: number; done: number; volume: number }>>((days, session) => {
    const existing = days.find((day) => day.date === session.date);
    const completedSession = getCompletedForPlan(sessions, session);
    if (existing) {
      existing.planned += 1;
      existing.done += completedSession ? 1 : 0;
      existing.volume += completedSession?.durationMin ?? 0;
      return days;
    }
    return [
      ...days,
      {
        date: session.date,
        planned: 1,
        done: completedSession ? 1 : 0,
        volume: completedSession?.durationMin ?? 0
      }
    ];
  }, []);

  return (
    <>
      {showTraining && sessionMode ? (
        <SessionMode
          session={sessionMode}
          energy={dailyContext.energyLevel}
          checkedItemIds={getCheckedItemIds(sessionMode.id)}
          completed={Boolean(getCompletedForPlan(sessions, sessionMode))}
          onToggle={(itemId, checked) => toggleChecklistItem(sessionMode.id, itemId, checked)}
          onClose={() => setSessionMode(null)}
          onFinish={() => {
            setLoggingSession(sessionMode);
            setSessionMode(null);
          }}
          onUndo={() => deletePlannedSessionCompletion(sessionMode)}
        />
      ) : null}

      {showSport ? (
        <SectionCard className="p-4 ring-1 ring-limeSoft/35 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Séance du jour</p>
              <p className="mt-1 text-sm font-bold text-muted">{formatLongDate(dashboard.today)}</p>
              <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.055em] text-petrol-800 sm:text-4xl">
                {todayPlanned?.title ?? (waitingForSessionChoice ? "Choisir une séance" : "Activité libre")}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge tone={completedPlannedSession ? "lime" : todayPlanned ? "default" : waitingForSessionChoice ? "info" : "muted"}>
                  {completedPlannedSession ? "Fait" : todayPlanned ? "À faire" : waitingForSessionChoice ? "À choisir" : "Libre"}
                </StatusBadge>
                <StatusBadge tone="muted">
                  {todayTypeLabel}{todayPlanned?.durationMin ? ` · ${todayPlanned.durationMin} min` : ""}
                </StatusBadge>
                <StatusBadge tone="muted">Semaine {dashboard.currentWeek}</StatusBadge>
              </div>
            </div>
          </div>

          {hasProgramChoices ? (
            <SessionChoiceCards
              sessions={weekSessionOptions}
              selectedValue={selectedPlanChoice}
              settings={dashboard.settings}
              onSelect={(selectedPlannedSessionId) =>
                saveDailyContext({
                  ...dailyContext,
                  date: dashboard.today,
                  selectedPlannedSessionId
                })
              }
            />
          ) : null}

          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            {todayPlanned ? (
              <button type="button" className="action-button" onClick={() => setSessionMode(todayPlanned)}>
                <PlayCircle className="h-5 w-5" /> {primaryActionLabel}
              </button>
            ) : waitingForSessionChoice ? (
              <p className="inline-flex min-h-12 items-center gap-2 rounded-card border border-petrol-800/10 bg-white/80 px-4 py-3 text-sm font-black text-petrol-800">
                <PlayCircle className="h-5 w-5 text-petrol-700" /> Choisis une carte pour lancer la séance.
              </p>
            ) : (
              <Link to={showSessions ? `/sessions?date=${dashboard.today}&add=1` : "/settings"} className="action-button">
                <PlayCircle className="h-5 w-5" /> {primaryActionLabel}
              </Link>
            )}
            {todayPlanned ? (
              <Link to={`/planning?week=${dashboard.currentWeek}#${todayPlanned.id}`} className="ghost-button">
                Détails
              </Link>
            ) : null}
          </div>

          {todayPlanned ? (
            <details className="mt-4 rounded-card border border-petrol-800/10 bg-white/[0.85] p-3 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
                Version du jour
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                {getDisplayedVersion(todayPlanned, dailyContext.energyLevel)}
              </p>
            </details>
          ) : null}

          {todayLoggedSessions.length ? (
            <details className="mt-4 rounded-card border border-petrol-800/10 bg-white/[0.85] p-3 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
                {todayLoggedSessions.length} séance{todayLoggedSessions.length > 1 ? "s" : ""} enregistrée{todayLoggedSessions.length > 1 ? "s" : ""}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </summary>
              <div className="mt-3 grid gap-2">
                {todayLoggedSessions.map((session) => (
                  <div key={session.id} className="flex flex-col gap-2 rounded-card bg-mist/45 p-3 ring-1 ring-petrol-800/5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-bold text-muted">
                      <span className="font-black text-petrol-800">{session.title}</span> · {session.durationMin} min
                      {session.caloriesBurned ? ` · ${session.caloriesBurned} kcal` : ""}
                    </p>
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
            </details>
          ) : null}
        </SectionCard>
      ) : (
        <SectionCard className="p-4 ring-1 ring-limeSoft/35 sm:p-5">
          <p className="eyebrow">Aujourd'hui</p>
          <p className="mt-1 text-sm font-bold text-muted">{formatLongDate(dashboard.today)}</p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.055em] text-petrol-800 sm:text-4xl">
            Ton action rapide
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Les modules sport restent masqués tant qu'ils ne sont pas activés dans Profil.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            {showNutrition ? (
              <Link to={`/meals?date=${dashboard.today}&add=1`} className="action-button">
                <Utensils className="h-5 w-5" /> Saisir un repas
              </Link>
            ) : showWeight ? (
              <Link to="/weight?add=1" className="action-button">
                <Scale className="h-5 w-5" /> Saisir le poids
              </Link>
            ) : (
              <Link to="/settings" className="action-button">
                Personnaliser
              </Link>
            )}
            {showCalendar ? (
              <Link to="/calendar" className="ghost-button">
                <CalendarCheck2 className="h-5 w-5" /> Calendrier
              </Link>
            ) : null}
            {showNutrition && showWeight ? (
              <Link to="/weight?add=1" className="ghost-button">
                <Scale className="h-5 w-5" /> Poids
              </Link>
            ) : null}
          </div>
        </SectionCard>
      )}

      {(showRecovery || showCalendar) ? (
        <SectionCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Quotidien</p>
              <h2 className="title-lg mt-1">Fatigue, douleur, sommeil, pas</h2>
            </div>
            {showRecovery ? <StatusBadge tone="muted">{dailyHint}</StatusBadge> : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {showRecovery ? (
              <>
                <label className="field-label">
                  Fatigue /10
                  <input
                    className="field"
                    type="number"
                    min="0"
                    max="10"
                    inputMode="numeric"
                    value={dailyContext.fatigueMorning ?? ""}
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
                    value={dailyContext.painMorning ?? ""}
                    onChange={(event) =>
                      saveDailyContext({
                        ...dailyContext,
                        date: dashboard.today,
                        painMorning: updateScoreInput(event.target.value)
                      })
                    }
                  />
                </label>
                <div className="field-label">
                  Sommeil
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {sleepOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`min-h-11 rounded-card border px-3 py-2 text-sm font-black transition ${
                          (dailyContext.sleepQuality ?? "medium") === option.id
                            ? "border-petrol-800 bg-petrol-800 text-white"
                            : "border-petrol-800/10 bg-white/80 text-petrol-800 hover:bg-white"
                        }`}
                        aria-pressed={(dailyContext.sleepQuality ?? "medium") === option.id}
                        onClick={() =>
                          saveDailyContext({
                            ...dailyContext,
                            date: dashboard.today,
                            sleepQuality: option.id
                          })
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {showCalendar ? (
              <>
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
                    placeholder="8500"
                  />
                </label>
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
                    placeholder="8"
                  />
                </label>
              </>
            ) : null}
          </div>

          {showRecovery ? (
            <div className="mt-4 grid gap-3 rounded-card bg-white/70 p-3 ring-1 ring-petrol-800/5 sm:grid-cols-3">
              <GaugeBar
                label="Fatigue"
                value={fatigueValue}
                max={10}
                valueLabel={fatigueValue ? `${fatigueValue}/10` : "non notée"}
                tone={gaugeTone(fatigueValue, 6, 8)}
                compact
              />
              <GaugeBar
                label="Douleur"
                value={painValue}
                max={10}
                valueLabel={painValue ? `${painValue}/10` : "OK"}
                tone={gaugeTone(painValue, 4, 7)}
                compact
              />
              <GaugeBar
                label="Récupération"
                value={recoveryValue}
                valueLabel={recoveryLabel(recoveryValue)}
                tone={recoveryValue < 45 ? "danger" : recoveryValue < 70 ? "warning" : "lime"}
                compact
              />
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {showSport ? (
        <SectionCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Progression semaine</p>
              <h2 className="title-lg mt-1">Où tu en es</h2>
            </div>
            {weekProgramCompletion.planned ? (
              <StatusBadge tone="lime">{weekProgramCompletion.ratio} % validé</StatusBadge>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            {weekProgramCompletion.planned ? (
              <WeekTrackerCard
                days={weekTrackerDays}
                completed={weekProgramCompletion.completed}
                planned={weekProgramCompletion.planned}
                volumeMin={weekVolumeDone}
                status={weekLoadStatus}
                progress={weekProgramCompletion.ratio}
              />
            ) : (
              <MetricTile label="Programme" value="Libre" hint="pas de plan actif" tone="lime" />
            )}

            <div className="grid gap-3 rounded-panel bg-white/75 p-4 ring-1 ring-petrol-800/5">
              <GaugeBar
                label="Régularité"
                value={weekProgramCompletion.ratio}
                valueLabel={weekProgramCompletion.planned ? `${weekProgramCompletion.completed}/${weekProgramCompletion.planned}` : "libre"}
                tone={weekProgramCompletion.ratio >= 65 ? "lime" : weekProgramCompletion.ratio >= 35 ? "warning" : "info"}
              />
              <GaugeBar
                label="Progression"
                value={Math.min(100, Math.max(0, progressionSummary.volumeTrendPercent + 50))}
                valueLabel={progressionSummary.volumeTrendPercent ? `${Math.round(progressionSummary.volumeTrendPercent)} %` : "stable"}
                tone={progressionSummary.volumeTrendPercent > 15 ? "warning" : progressionSummary.volumeTrendPercent < -25 ? "info" : "lime"}
              />
              <GaugeBar
                label="Récupération"
                value={recoveryValue}
                valueLabel={recoveryLabel(recoveryValue)}
                tone={recoveryValue < 45 ? "danger" : recoveryValue < 70 ? "warning" : "lime"}
              />
            </div>
          </div>

          <details className="mt-4 rounded-card border border-petrol-800/10 bg-white/[0.78] p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
              Détails progression
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </summary>
            <div className="mt-3">
              <ProgressionSnapshot summary={progressionSummary} compact />
            </div>
          </details>
        </SectionCard>
      ) : null}

      {showTraining && loggingSession ? (
        <ActionPanel
          eyebrow="Fin de séance"
          title="Saisir le réel"
          description="Garde juste l'essentiel : durée, RPE, douleur, puis enregistrer."
        >
          <SessionForm
            planned={loggingSession}
            initial={getCompletedForPlan(sessions, loggingSession) ?? { date: dashboard.today }}
            onCancel={() => setLoggingSession(null)}
            onSubmit={(session) => {
              saveSession(session);
              setLoggingSession(null);
            }}
          />
        </ActionPanel>
      ) : null}

      {showNutrition ? (
        <CollapsibleSectionCard
          title={showNutritionNumbers ? `Nutrition : ${remainingLabel(dashboard.remainingCalories)}` : "Journal repas"}
          summary={showNutritionNumbers ? "Calories, protéines et conseil rapide." : "Repas et sensations, sans chiffres forcés."}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-sm font-semibold leading-6 text-muted">
              {showNutritionNumbers ? "Un repère simple, pas un tableau de bord." : "Note ce qui compte, sans calories ni macros."}
            </p>
            <Link to={`/meals?date=${dashboard.today}&add=1`} className="action-button">
              <Utensils className="h-5 w-5" /> Saisir mon repas
            </Link>
          </div>

          {showNutritionNumbers ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MetricTile label="Protéines" value={`${Math.round(dashboard.todayMealTotals.protein)} / ${proteinTarget} g`} />
              <div className="rounded-card bg-mist/50 p-4 ring-1 ring-limeSoft/45">
                <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">Conseil</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">{mealAdvice}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-card bg-mist/50 p-4 text-sm font-semibold leading-6 text-ink ring-1 ring-limeSoft/45">
              Si tu veux les calories/macros, active le mode complet dans Profil.
            </p>
          )}

          {nutritionReminders.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {nutritionReminders.map((reminder) => (
                <StatusBadge key={reminder} tone="danger">
                  {reminder}
                </StatusBadge>
              ))}
            </div>
          ) : null}
        </CollapsibleSectionCard>
      ) : null}
    </>
  );
}
