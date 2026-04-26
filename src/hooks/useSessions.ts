import type { CompletedSession, CompletedSessionType, PlannedSession } from "../types";
import { deleteSession, makeId, upsertSession } from "../services/storageService";
import { estimateCaloriesFromSession } from "../utils/calories";
import { buildCompletedExercises, mergeSessionNotesWithPlannedExercises } from "../utils/sessionExercises";
import { useStoredData } from "./useStoredData";

function plannedTypeToCompleted(type: PlannedSession["type"]): CompletedSessionType {
  if (type === "rest") return "recovery";
  return type;
}

export function useSessions() {
  const data = useStoredData();
  const sessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const deletePlannedSessionCompletion = (plannedSessionId: string) => {
    const completed = sessions.find((session) => session.plannedSessionId === plannedSessionId);
    if (completed) deleteSession(completed.id);
  };

  return {
    sessions,
    saveSession: (session: CompletedSession) => upsertSession(session),
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
