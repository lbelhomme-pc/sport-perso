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

  const longest = getMaxBy(completed, (session) => session.durationMin);
  const calories = getMaxBy(completed, (session) => session.caloriesBurned ?? 0);
  const rpeControlledLong = getMaxBy(
    completed.filter((session) => (session.rpe ?? 10) <= 7),
    (session) => session.durationMin
  );
  const maxLoad = sessions30d
    .flatMap((session) => session.exercises ?? [])
    .map((exercise) => exercise.loadKg ?? 0)
    .reduce((best, load) => Math.max(best, load), 0);

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
    maxLoad > 0
      ? {
          label: "Charge max notée",
          value: `${maxLoad} kg`,
          hint: "D'après les exercices renseignés"
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
    ? "Douleur répétée : baisse charge, impacts et intensité."
    : highFatigueDays >= 3
      ? "Fatigue haute plusieurs matins : récup active ou semaine allégée."
      : averageRpe7d >= 8
        ? "RPE moyen élevé : garde de la marge sur les prochaines séances."
        : volumeTrendPercent > 35 && volume7d >= 180
          ? "Volume en hausse rapide : stabilise avant d'ajouter plus."
          : "Charge cohérente : progresse sans forcer tous les voyants.";

  const coachingMessage = !completed.length
    ? "Saisis 2 séances pour obtenir une vraie lecture de progression."
    : deloadRecommended
      ? `Deload conseillé : ${deloadReason}`
      : activeDays7d >= 3
        ? `Bonne régularité : ${activeDays7d} jours actifs, volume ${formatSignedPercent(volumeTrendPercent)}.`
        : "Objectif simple : vise 2 à 3 jours actifs cette semaine avant de chercher plus compliqué.";

  const badges: HealthyBadge[] = [
    {
      id: "regularity",
      label: "Régularité utile",
      hint: "Au moins 3 jours actifs sur 7.",
      earned: activeDays7d >= 3
    },
    {
      id: "balanced-week",
      label: "Semaine équilibrée",
      hint: "Au moins 2 types de séances, RPE moyen maîtrisé.",
      earned: typeVariety >= 2 && averageRpe7d > 0 && averageRpe7d <= 7
    },
    {
      id: "rest-respected",
      label: "Repos respecté",
      hint: "Au moins 1 jour sans séance sur 7.",
      earned: restDays7d >= 1
    },
    {
      id: "deload-smart",
      label: "Deload intelligent",
      hint: "Aucun signal fort de fatigue/douleur cette semaine.",
      earned: !deloadRecommended && completed.length > 0
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
    badges
  };
}
