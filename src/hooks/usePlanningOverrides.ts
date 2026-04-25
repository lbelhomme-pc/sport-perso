import type { PlannedSession, PlannedSessionOverride } from "../types";
import { deletePlannedSessionOverride, upsertPlannedSessionOverride } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function applyPlannedSessionOverride(session: PlannedSession, override?: PlannedSessionOverride): PlannedSession {
  if (!override) return session;

  return {
    ...session,
    title: override.title ?? session.title,
    type: override.type ?? session.type,
    durationMin: override.durationMin ?? session.durationMin,
    objective: override.objective ?? session.objective,
    exercises: override.exercises ?? session.exercises
  };
}

export function usePlanningOverrides() {
  const data = useStoredData();

  return {
    plannedSessionOverrides: data.plannedSessionOverrides,
    getOverride: (plannedSessionId: string) =>
      data.plannedSessionOverrides.find((item) => item.plannedSessionId === plannedSessionId),
    saveNotes: (session: PlannedSession, notes: string) =>
      upsertPlannedSessionOverride({
        ...(data.plannedSessionOverrides.find((item) => item.plannedSessionId === session.id) ?? {
          plannedSessionId: session.id,
          date: session.date,
          updatedAt: ""
        }),
        notes
      }),
    resetOverride: deletePlannedSessionOverride
  };
}
