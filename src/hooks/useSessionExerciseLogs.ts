import type { SessionExerciseLog } from "../types";
import { upsertSessionExerciseLog } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useSessionExerciseLogs(plannedSessionId?: string) {
  const data = useStoredData();

  return {
    sessionExerciseLogs: plannedSessionId
      ? data.sessionExerciseLogs.filter((item) => item.plannedSessionId === plannedSessionId)
      : data.sessionExerciseLogs,
    getExerciseLog: (sessionId: string, exerciseId: string) =>
      data.sessionExerciseLogs.find((item) => item.plannedSessionId === sessionId && item.exerciseId === exerciseId),
    saveExerciseLog: (log: SessionExerciseLog) => upsertSessionExerciseLog(log)
  };
}
