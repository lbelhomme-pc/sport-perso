import type { PlannedSession, PlannedSessionOverride } from "../types";
import { deletePlannedSessionOverride, upsertPlannedSessionOverride } from "../services/storageService";
import { useStoredData } from "./useStoredData";

function normalizePlanningTitle(session: PlannedSession, title: string) {
  const isPlaceholder =
    title.trim() === "Badminton" ||
    title.toLowerCase().includes("séance modifiable") ||
    title.toLowerCase().includes("seance modifiable") ||
    title.toLowerCase().includes("modifiable dans l'app") ||
    title.toLowerCase().includes("modifiable dans l’app");

  if (session.type === "badminton" && isPlaceholder) {
    return "Badminton — intensité contrôlée + appuis";
  }

  return title;
}

export function applyPlannedSessionOverride(session: PlannedSession, override?: PlannedSessionOverride): PlannedSession {
  if (!override) {
    return {
      ...session,
      title: normalizePlanningTitle(session, session.title)
    };
  }

  const title = normalizePlanningTitle(session, override.title ?? session.title);

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
