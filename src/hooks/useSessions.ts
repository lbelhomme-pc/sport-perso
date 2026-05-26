import type { CompletedSession, CompletedSessionType, PlannedSession } from "../types";
import { getPlannedWeek } from "../data/trainingPlan";
import { applyPlannedSessionOverride } from "./usePlanningOverrides";
import { deleteSession, makeId, upsertSession } from "../services/storageService";
import { estimateCaloriesFromSession } from "../utils/calories";
import { getWeekIndexForDate } from "../utils/dates";
import { buildCompletedExercises, mergeSessionNotesWithPlannedExercises } from "../utils/sessionExercises";
import { findMatchingPlannedSessionForCompleted, getCompletedForPlan, getPlannedSessionIds } from "../utils/training";
import { useStoredData } from "./useStoredData";

function plannedTypeToCompleted(type: PlannedSession["type"]): CompletedSessionType {
  if (type === "rest") return "recovery";
  return type;
}

export function useSessions() {
  const data = useStoredData();
  const sessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const inferPlannedSession = (session: CompletedSession) => {
    if (session.plannedSessionId || !session.completed) return session;
    if (session.date < data.settings.startDate || session.date > data.settings.targetDate) return session;

    const week = getWeekIndexForDate(data.settings.startDate, data.settings.targetDate, session.date);
    const plannedWeek = getPlannedWeek(data.settings, week, data.settings.badmintonVariant).map((plannedSession) => {
      const plannedIds = getPlannedSessionIds(plannedSession);
      const override = data.plannedSessionOverrides.find((item) => plannedIds.includes(item.plannedSessionId));
      return applyPlannedSessionOverride(plannedSession, override);
    });
    const matchedPlannedSession = findMatchingPlannedSessionForCompleted(session, plannedWeek, data.sessions);

    return matchedPlannedSession ? { ...session, plannedSessionId: matchedPlannedSession.id } : session;
  };
  const deletePlannedSessionCompletion = (plannedSession: PlannedSession | string) => {
    const plannedIds = getPlannedSessionIds(plannedSession);
    const completed =
      typeof plannedSession === "string"
        ? sessions.find((session) => session.plannedSessionId && plannedIds.includes(session.plannedSessionId))
        : getCompletedForPlan(sessions, plannedSession);
    if (completed) deleteSession(completed.id);
  };

  return {
    sessions,
    saveSession: (session: CompletedSession) => upsertSession(inferPlannedSession(session)),
    deleteSession,
    deletePlannedSessionCompletion,
    markPlannedSessionCompleted: (planned: PlannedSession) =>
      upsertSession({
        id: makeId("session"),
        plannedSessionId: planned.id,
        date: planned.date,
        type: plannedTypeToCompleted(planned.type),
        title: planned.title,
        durationMin: planned.durationMin,
        caloriesBurned: estimateCaloriesFromSession(plannedTypeToCompleted(planned.type), planned.durationMin),
        rpe: planned.type === "recovery" ? 3 : planned.type === "badminton" ? 7 : 6,
        notes: mergeSessionNotesWithPlannedExercises("", planned),
        completed: true,
        exercises: buildCompletedExercises(
          planned,
          true,
          data.sessionExerciseLogs.filter((item) => item.plannedSessionId === planned.id)
        )
      })
  };
}
