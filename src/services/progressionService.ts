import { subDays } from "date-fns";
import type { CompletedSession, DailyContext } from "../types";
import { toISODate } from "../utils/dates";

export type ProgressionRecord = {
  label: string;
  value: string;
  hint: string;
};

export type HealthyBadge = {
  id: string;
  label: string;
  hint: string;
  earned: boolean;
};

export type MotivationTone = "positive" | "care" | "neutral";

export type MotivationMessage = {
  id: string;
  title: string;
  message: string;
  tone: MotivationTone;
};

export type SportProgressionSummary = {
  sessions7d: number;
  volume7d: number;
  previousVolume7d: number;
  volumeTrendPercent: number;
  activeDays7d: number;
  averageRpe7d: number;
  strengthVolume30d: number;
  records: ProgressionRecord[];
  deloadRecommended: boolean;
  deloadReason: string;
  coachingMessage: string;
  motivationMessages: MotivationMessage[];
  badges: HealthyBadge[];
};

function dateDaysAgo(today: string, days: number) {
  return toISODate(subDays(new Date(`${today}T00:00:00`), days));
}

function inRange(date: string, from: string, to: string) {
  return date >= from && date <= to;
}

function uniqueDateCount(items: { date: string }[]) {
  return new Set(items.map((item) => item.date)).size;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatSignedPercent(value: number) {
  if (!Number.isFinite(value) || value === 0) return "stable";
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded} %`;
}

function getSessionStrengthVolume(session: CompletedSession) {
  return (session.exercises ?? []).reduce((total, exercise) => {
    const sets = exercise.setsDone ?? 1;
    const reps = exercise.repsDone ?? 1;
    const load = exercise.loadKg ?? 0;
    return total + sets * reps * load;
  }, 0);
}

function getMaxBy<T>(items: T[], value: (item: T) => number) {
  return items.reduce<T | undefined>((best, item) => {
    if (!best) return item;
    return value(item) > value(best) ? item : best;
  }, undefined);
}

export function getSportProgressionSummary({
  sessions,
  dailyContexts,
  today = toISODate(new Date())
}: {
  sessions: CompletedSession[];
  dailyContexts: DailyContext[];
  today?: string;
}): SportProgressionSummary {
  const completed = sessions.filter((session) => session.completed);
  const last7Start = dateDaysAgo(today, 6);
  const previous7Start = dateDaysAgo(today, 13);
  const previous7End = dateDaysAgo(today, 7);
  const last30Start = dateDaysAgo(today, 29);
  const sessions7d = completed.filter((session) => inRange(session.date, last7Start, today));
  const previousSessions7d = completed.filter((session) => inRange(session.date, previous7Start, previous7End));
  const sessions30d = completed.filter((session) => inRange(session.date, last30Start, today));
  const olderCompleted = completed.filter((session) => session.date < last7Start);
  const volume7d = sessions7d.reduce((total, session) => total + session.durationMin, 0);
  const previousVolume7d = previousSessions7d.reduce((total, session) => total + session.durationMin, 0);
  const volumeTrendPercent = previousVolume7d > 0 ? ((volume7d - previousVolume7d) / previousVolume7d) * 100 : 0;
  const rpeValues7d = sessions7d.map((session) => session.rpe).filter((value): value is number => typeof value === "number");
  const averageRpe7d = Math.round(average(rpeValues7d) * 10) / 10;
  const activeDays7d = uniqueDateCount(sessions7d);
  const restDays7d = Math.max(0, 7 - activeDays7d);
  const strengthVolume30d = Math.round(sessions30d.reduce((total, session) => total + getSessionStrengthVolume(session), 0));
  const highFatigueDays = dailyContexts.filter((context) => inRange(context.date, last7Start, today) && (context.fatigueMorning ?? 0) >= 7).length;
  const highPainDays = dailyContexts.filter((context) => inRange(context.date, last7Start, today) && (context.painMorning ?? 0) >= 4).length;
  const highPainSessions = sessions7d.filter((session) => (session.painDuring ?? 0) >= 7 || session.pain).length;
  const typeVariety = new Set(sessions7d.map((session) => session.type)).size;
  const resumedAfterPause = sessions7d.length > 0 && previousSessions7d.length === 0 && olderCompleted.length > 0;
  const firstWeekStarted = sessions7d.length > 0 && previousSessions7d.length === 0 && olderCompleted.length === 0;
  const balancedWeek = typeVariety >= 2 && restDays7d >= 1 && averageRpe7d > 0 && averageRpe7d <= 7;
  const stableVolume = volume7d > 0 && previousVolume7d > 0 && Math.abs(volumeTrendPercent) <= 15;
  const controlledProgression =
    volume7d > 0 &&
    (previousVolume7d === 0 || (volumeTrendPercent >= 0 && volumeTrendPercent <= 30)) &&
    (averageRpe7d === 0 || averageRpe7d <= 7.5) &&
    highPainDays === 0 &&
    highPainSessions === 0 &&
    highFatigueDays <= 2;

  const longest = getMaxBy(completed, (session) => session.durationMin);
  const calories = getMaxBy(completed, (session) => session.caloriesBurned ?? 0);
  const rpeControlledLong = getMaxBy(
    completed.filter((session) => (session.rpe ?? 10) <= 7),
    (session) => session.durationMin
  );
  const records: ProgressionRecord[] = [
    longest
      ? {
          label: "Plus longue séance",
          value: `${longest.durationMin} min`,
          hint: longest.title
        }
      : undefined,
    calories?.caloriesBurned
      ? {
          label: "Plus grosse dépense",
          value: `${Math.round(calories.caloriesBurned)} kcal`,
          hint: calories.title
        }
      : undefined,
    rpeControlledLong
      ? {
          label: "Endurance contrôlée",
          value: `${rpeControlledLong.durationMin} min`,
          hint: `RPE ${rpeControlledLong.rpe ?? "ok"}`
        }
      : undefined
  ].filter((item): item is ProgressionRecord => Boolean(item));

  const deloadRecommended =
    highPainDays >= 2 ||
    highPainSessions >= 1 ||
    highFatigueDays >= 3 ||
    averageRpe7d >= 8 ||
    (volumeTrendPercent > 35 && volume7d >= 180);
  const deloadReason = highPainDays >= 2 || highPainSessions >= 1
    ? "Douleur répétée : baisse impacts et intensité."
    : highFatigueDays >= 3
      ? "Fatigue haute plusieurs matins : récup active ou semaine allégée."
      : averageRpe7d >= 8
        ? "RPE moyen élevé : garde de la marge sur les prochaines séances."
        : volumeTrendPercent > 35 && volume7d >= 180
          ? "Volume en hausse rapide : stabilise avant d'ajouter plus."
          : "Progression cohérente : garde de la marge.";

  const coachingMessage = !completed.length
    ? "Commence simple : une séance courte suffit pour lancer la tendance."
    : deloadRecommended
      ? `À alléger : ${deloadReason}`
      : activeDays7d >= 3
        ? `Bonne régularité : ${activeDays7d} jours actifs, volume ${formatSignedPercent(volumeTrendPercent)}.`
        : "Objectif simple : vise 2 à 3 jours actifs cette semaine avant de chercher plus compliqué.";

  const motivationMessages: MotivationMessage[] = [
    !completed.length
      ? {
          id: "no-data",
          title: "Point de départ",
          message: "Ajoute une séance courte quand tu peux. Le but est de revenir, pas de tout réussir d'un coup.",
          tone: "neutral" as const
        }
      : undefined,
    highPainDays > 0 || highPainSessions > 0
      ? {
          id: "pain-watch",
          title: "Douleur à surveiller",
          message: "Note où ça gêne et garde léger aujourd'hui. Une séance courte suffit.",
          tone: "care" as const
        }
      : undefined,
    highFatigueDays >= 2 || averageRpe7d >= 8
      ? {
          id: "high-fatigue",
          title: "Fatigue haute",
          message: "Réduis l'intensité, privilégie mobilité ou zone facile. Le repos compte aussi.",
          tone: "care" as const
        }
      : undefined,
    resumedAfterPause
      ? {
          id: "restart",
          title: "Reprise réussie",
          message: "Tu as relancé la routine. Garde court et régulier avant d'ajouter du volume.",
          tone: "positive" as const
        }
      : undefined,
    firstWeekStarted
      ? {
          id: "first-step",
          title: "Départ lancé",
          message: "Première trace enregistrée. Le prochain objectif, c'est simplement de revenir.",
          tone: "positive" as const
        }
      : undefined,
    balancedWeek
      ? {
          id: "balanced-week-message",
          title: "Semaine équilibrée",
          message: "Tu combines variété, repos et intensité maîtrisée. Continue comme ça.",
          tone: "positive" as const
        }
      : undefined,
    activeDays7d >= 3 && !deloadRecommended
      ? {
          id: "good-regularity",
          title: "Bonne régularité",
          message: "Trois jours actifs ou plus : base solide. Inutile d'en rajouter pour cocher plus.",
          tone: "positive" as const
        }
      : undefined,
    stableVolume
      ? {
          id: "stable-volume-message",
          title: "Volume stable",
          message: "La charge est régulière. Si les sensations sont bonnes, garde ce rythme.",
          tone: "neutral" as const
        }
      : undefined
  ].filter((item): item is MotivationMessage => Boolean(item)).slice(0, 3);

  const badges: HealthyBadge[] = [
    {
      id: "active-3-days",
      label: "3 jours actifs",
      hint: "Au moins 3 jours actifs sur 7.",
      earned: activeDays7d >= 3
    },
    {
      id: "rest-respected",
      label: "Récupération respectée",
      hint: "Au moins 1 jour sans séance sur 7.",
      earned: restDays7d >= 1
    },
    {
      id: "stable-volume",
      label: "Volume stable",
      hint: "Volume proche de la semaine précédente.",
      earned: stableVolume
    },
    {
      id: "restart-success",
      label: "Reprise réussie",
      hint: "Retour à l'entraînement après une pause ou premier pas lancé.",
      earned: resumedAfterPause || firstWeekStarted
    },
    {
      id: "balanced-week",
      label: "Semaine équilibrée",
      hint: "Variété, repos et RPE moyen maîtrisé.",
      earned: balancedWeek
    },
    {
      id: "controlled-progression",
      label: "Progression maîtrisée",
      hint: "Volume en hausse raisonnable sans douleur marquée.",
      earned: controlledProgression
    }
  ];

  return {
    sessions7d: sessions7d.length,
    volume7d,
    previousVolume7d,
    volumeTrendPercent: Math.round(volumeTrendPercent),
    activeDays7d,
    averageRpe7d,
    strengthVolume30d,
    records,
    deloadRecommended,
    deloadReason,
    coachingMessage,
    motivationMessages,
    badges
  };
}
