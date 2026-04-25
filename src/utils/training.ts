import type { CompletedSession, PlannedSession, WeekSummary } from "../types";
import { isDateInWeek } from "./dates";
import { getSportCalories } from "./calories";

export function getSessionsForDate(sessions: CompletedSession[], date: string): CompletedSession[] {
  return sessions.filter((session) => session.date === date);
}

export function getCompletedForPlan(sessions: CompletedSession[], plannedSessionId: string): CompletedSession | undefined {
  return sessions.find((session) => session.plannedSessionId === plannedSessionId && session.completed);
}

export function summarizeWeek(
  week: number,
  weekStart: Date,
  plannedSessions: PlannedSession[],
  completedSessions: CompletedSession[]
): WeekSummary {
  const weekSessions = completedSessions.filter((session) => isDateInWeek(session.date, weekStart));
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");

  return {
    week,
    planned: plannedTrainings.length,
    completed: weekSessions.filter((session) => session.completed).length,
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
