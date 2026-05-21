import type { PlannedSession, PlannedSessionOverride } from "../types";
import { deletePlannedSessionOverride, upsertPlannedSessionOverride } from "../services/storageService";
import { getPlannedSessionIds } from "../utils/training";
import { useStoredData } from "./useStoredData";

function normalizePlanningTitle(title: string) {
  return title;
}

export function applyPlannedSessionOverride(session: PlannedSession, override?: PlannedSessionOverride): PlannedSession {
  if (!override) {
    return {
      ...session,
      title: normalizePlanningTitle(session.title)
    };
  }

  const title = normalizePlanningTitle(override.title ?? session.title);

  return {
    ...session,
    title,
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
    getOverride: (plannedSession: PlannedSession | string) => {
      const plannedIds = getPlannedSessionIds(plannedSession);
      return data.plannedSessionOverrides.find((item) => plannedIds.includes(item.plannedSessionId));
    },
    saveNotes: (session: PlannedSession, notes: string) =>
      upsertPlannedSessionOverride({
        ...(data.plannedSessionOverrides.find((item) => item.plannedSessionId === session.id) ?? {
          plannedSessionId: session.id,
          updatedAt: ""
        }),
        notes
      }),
    resetOverride: deletePlannedSessionOverride
  };
}
