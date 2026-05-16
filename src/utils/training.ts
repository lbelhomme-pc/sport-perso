import type { CompletedSession, PlannedSession, WeekSummary } from "../types";
import { isDateInWeek } from "./dates";
import { getSportCalories } from "./calories";

export function getSessionsForDate(sessions: CompletedSession[], date: string): CompletedSession[] {
  return sessions.filter((session) => session.date === date);
}

export function getCompletedForPlan(sessions: CompletedSession[], plannedSessionId: string): CompletedSession | undefined {
  return sessions.find((session) => session.plannedSessionId === plannedSessionId && session.completed);
}

export function getPlannedCompletion(plannedSessions: PlannedSession[], completedSessions: CompletedSession[]) {
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");
  const plannedIds = new Set(plannedTrainings.map((session) => session.id));
  const completedIds = new Set(
    completedSessions
      .filter((session) => session.completed && session.plannedSessionId && plannedIds.has(session.plannedSessionId))
      .map((session) => session.plannedSessionId!)
  );
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
