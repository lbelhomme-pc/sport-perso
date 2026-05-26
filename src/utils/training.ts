import type { CompletedSession, PlannedSession, WeekSummary } from "../types";
import { getMonday, isDateInWeek, parseDate } from "./dates";
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

function isCompletedTypeCompatibleWithPlan(session: CompletedSession, plannedSession: PlannedSession) {
  if (plannedSession.type === "rest") return false;
  if (session.type === plannedSession.type) return true;
  if (plannedSession.type === "hyrox" && session.type === "hybrid") return true;
  if (plannedSession.type === "racket" && ["badminton", "tennis", "padel"].includes(session.type)) return true;
  if (plannedSession.type === "run" && session.type === "trail") return true;
  return false;
}

function isCompletedInPlannedWeek(session: CompletedSession, plannedSession: PlannedSession) {
  return isDateInWeek(session.date, getMonday(parseDate(plannedSession.date)));
}

function getInferredPlannedSession(
  session: CompletedSession,
  plannedSessions: PlannedSession[],
  usedPlannedIds: Set<string>
): PlannedSession | undefined {
  if (!session.completed || session.plannedSessionId) return undefined;

  return plannedSessions
    .filter((plannedSession) => !usedPlannedIds.has(plannedSession.id))
    .filter((plannedSession) => isCompletedTypeCompatibleWithPlan(session, plannedSession))
    .filter((plannedSession) => isCompletedInPlannedWeek(session, plannedSession))
    .sort((left, right) => Math.abs(left.durationMin - session.durationMin) - Math.abs(right.durationMin - session.durationMin))[0];
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

export function findMatchingPlannedSessionForCompleted(
  completedSession: CompletedSession,
  plannedSessions: PlannedSession[],
  completedSessions: CompletedSession[] = []
): PlannedSession | undefined {
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");

  if (completedSession.plannedSessionId) {
    return plannedTrainings.find((plannedSession) => isCompletedForPlannedSession(completedSession, plannedSession));
  }

  const usedPlannedIds = new Set<string>();
  completedSessions
    .filter((session) => session.id !== completedSession.id)
    .forEach((session) => {
      const plannedSession = plannedTrainings.find((item) => isCompletedForPlannedSession(session, item));
      if (plannedSession) usedPlannedIds.add(plannedSession.id);
    });

  return getInferredPlannedSession(completedSession, plannedTrainings, usedPlannedIds);
}

export function getPlannedCompletionMap(plannedSessions: PlannedSession[], completedSessions: CompletedSession[]) {
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");
  const completedByPlannedId = new Map<string, CompletedSession>();
  const matchedCompletedIds = new Set<string>();

  completedSessions.forEach((completedSession) => {
    const plannedSession = plannedTrainings.find(
      (session) => !completedByPlannedId.has(session.id) && isCompletedForPlannedSession(completedSession, session)
    );
    if (plannedSession) {
      completedByPlannedId.set(plannedSession.id, completedSession);
      matchedCompletedIds.add(completedSession.id);
    }
  });

  completedSessions
    .filter((completedSession) => !matchedCompletedIds.has(completedSession.id))
    .forEach((completedSession) => {
      const plannedSession = getInferredPlannedSession(completedSession, plannedTrainings, new Set(completedByPlannedId.keys()));
      if (plannedSession) {
        completedByPlannedId.set(plannedSession.id, completedSession);
        matchedCompletedIds.add(completedSession.id);
      }
    });

  return completedByPlannedId;
}

export function getPlannedCompletion(plannedSessions: PlannedSession[], completedSessions: CompletedSession[]) {
  const plannedTrainings = plannedSessions.filter((session) => session.type !== "rest");
  const completedByPlannedId = getPlannedCompletionMap(plannedTrainings, completedSessions);
  const planned = plannedTrainings.length;
  const completed = completedByPlannedId.size;

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
