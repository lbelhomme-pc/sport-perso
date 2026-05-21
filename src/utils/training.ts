import type { CompletedSession, PlannedSession, WeekSummary } from "../types";
import { isDateInWeek } from "./dates";
import { getSportCalories } from "./calories";

export function getSessionsForDate(sessions: CompletedSession[], date: string): CompletedSession[] {
  return sessions.filter((session) => session.date === date);
}

const weekdayLabels = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function getWeekdayLabel(date: string) {
  return weekdayLabels[new Date(`${date}T00:00:00`).getDay()];
}

export function getPlannedSessionIds(plannedSession: PlannedSession | string): string[] {
  if (typeof plannedSession === "string") return [plannedSession];
  return [plannedSession.id, ...(plannedSession.legacyIds ?? [])];
}

function getPlannedSlot(plannedSession: PlannedSession) {
  const parts = plannedSession.id.split("-");
  return parts.length > 3 ? parts.slice(3).join("-") : plannedSession.type;
}

function isCompletedForPlannedSession(session: CompletedSession, plannedSession: PlannedSession | string) {
  if (!session.completed || !session.plannedSessionId) return false;
  const plannedIds = getPlannedSessionIds(plannedSession);
  if (plannedIds.includes(session.plannedSessionId)) return true;
  if (typeof plannedSession === "string") return false;

  const legacyMatch = session.plannedSessionId.match(/^week-(\d+)-(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!legacyMatch) return false;

  const [, legacyWeek, legacyDate, legacySlot] = legacyMatch;
  return (
    Number(legacyWeek) === plannedSession.week &&
    legacySlot === getPlannedSlot(plannedSession) &&
    getWeekdayLabel(legacyDate) === plannedSession.day
  );
}

export function getCompletedForPlan(sessions: CompletedSession[], plannedSession: PlannedSession | string): CompletedSession | undefined {
  return sessions.find((session) => isCompletedForPlannedSession(session, plannedSession));
}

export function getPlannedCompletion(plannedSessions: PlannedSession[], completedSessions: CompletedSession[]) {
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");
  const completedIds = new Set<string>();

  completedSessions.forEach((completedSession) => {
    const plannedSession = plannedTrainings.find((session) => isCompletedForPlannedSession(completedSession, session));
    if (plannedSession) {
      completedIds.add(plannedSession.id);
    }
  });

  const planned = plannedTrainings.length;
  const completed = completedIds.size;

  return {
    planned,
    completed,
    ratio: planned > 0 ? Math.round((completed / planned) * 100) : 0
  };
}

export function summarizeWeek(
  week: number,
  weekStart: Date,
  plannedSessions: PlannedSession[],
  completedSessions: CompletedSession[]
): WeekSummary {
  const weekSessions = completedSessions.filter((session) => isDateInWeek(session.date, weekStart));
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");
  const plannedCompletion = getPlannedCompletion(plannedSessions, completedSessions);

  return {
    week,
    planned: plannedTrainings.length,
    completed: plannedCompletion.completed,
    badminton: weekSessions.filter((session) => session.type === "badminton").length,
    strength: weekSessions.filter((session) => session.type === "strength").length,
    volumeMin: weekSessions.reduce((total, session) => total + session.durationMin, 0),
    sportCalories: getSportCalories(weekSessions)
  };
}

export function getAverageRpe(sessions: CompletedSession[]): number {
  const values = sessions.map((session) => session.rpe).filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
}

export function getAverageHeartRate(sessions: CompletedSession[]): number {
  const values = sessions
    .map((session) => session.averageHeartRate)
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}
