import type { AppData } from "../types";
import { loadData, parseAppData, replaceData } from "./storageService";
import { toISODate } from "../utils/dates";

export type ImportMergeSummary = {
  files: number;
  sessions: number;
  meals: number;
  favoriteMeals: number;
  weights: number;
  dailyContexts: number;
  dailyHabits: number;
  sessionExerciseLogs: number;
  planningComments: number;
  calibrations: number;
};

type MergeableRecord = {
  id?: string;
  date?: string;
  updatedAt?: string;
};

function safeTimestamp(value?: string): number {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function recordTimestamp(record: MergeableRecord): number {
  return Math.max(safeTimestamp(record.updatedAt), safeTimestamp(record.date));
}

function keepNewest<T extends MergeableRecord>(current: T, incoming: T): T {
  return recordTimestamp(incoming) >= recordTimestamp(current) ? incoming : current;
}

function mergeByKey<T extends MergeableRecord>(currentItems: T[], incomingItems: T[], getKey: (item: T) => string): T[] {
  const merged = new Map<string, T>();

  currentItems.forEach((item) => merged.set(getKey(item), item));
  incomingItems.forEach((item) => {
    const key = getKey(item);
    const existing = merged.get(key);
    merged.set(key, existing ? keepNewest(existing, item) : item);
  });

  return [...merged.values()].sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
}

function getSettingsTimestamp(data: AppData): number {
  return Math.max(safeTimestamp(data.settings.updatedAt), safeTimestamp(data.appUpdatedAt));
}

export function mergeAppData(currentData: AppData, incomingData: AppData): AppData {
  const current = parseAppData(currentData);
  const incoming = parseAppData(incomingData);
  const settings = getSettingsTimestamp(incoming) > getSettingsTimestamp(current) ? incoming.settings : current.settings;

  return parseAppData({
    appUpdatedAt: new Date().toISOString(),
    settings,
    sessions: mergeByKey(current.sessions, incoming.sessions, (item) => item.id),
    meals: mergeByKey(current.meals, incoming.meals, (item) => item.id),
    favoriteMeals: mergeByKey(current.favoriteMeals, incoming.favoriteMeals, (item) => item.id),
    weights: mergeByKey(current.weights, incoming.weights, (item) => item.date),
    dailyContexts: mergeByKey(current.dailyContexts, incoming.dailyContexts, (item) => item.date),
    dailyHabits: mergeByKey(current.dailyHabits, incoming.dailyHabits, (item) => `${item.date}-${item.type}`),
    sessionExerciseLogs: mergeByKey(
      current.sessionExerciseLogs,
      incoming.sessionExerciseLogs,
      (item) => `${item.plannedSessionId}-${item.exerciseId}`
    ),
    sessionChecklists: mergeByKey(current.sessionChecklists, incoming.sessionChecklists, (item) => item.plannedSessionId),
    plannedSessionOverrides: mergeByKey(current.plannedSessionOverrides, incoming.plannedSessionOverrides, (item) => item.plannedSessionId),
    calibrations: mergeByKey(current.calibrations, incoming.calibrations, (item) => item.id)
  });
}

export function exportJson(): void {
  const data = loadData();
  const exportedAt = new Date().toISOString();
  const blob = new Blob([JSON.stringify({ ...data, appUpdatedAt: data.appUpdatedAt || exportedAt }, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sport-progress-tracker-${toISODate(new Date())}-${exportedAt.slice(11, 16).replace(":", "h")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importJsonFile(file: File): Promise<AppData> {
  const text = await file.text();
  const parsed = parseAppData(JSON.parse(text));
  return replaceData(parsed);
}

export async function mergeJsonFiles(files: FileList | File[]): Promise<ImportMergeSummary> {
  let merged = loadData();
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const text = await file.text();
    merged = mergeAppData(merged, parseAppData(JSON.parse(text)));
  }

  const saved = replaceData(merged);

  return {
    files: fileArray.length,
    sessions: saved.sessions.length,
    meals: saved.meals.length,
    favoriteMeals: saved.favoriteMeals.length,
    weights: saved.weights.length,
    dailyContexts: saved.dailyContexts.length,
    dailyHabits: saved.dailyHabits.length,
    sessionExerciseLogs: saved.sessionExerciseLogs.length,
    planningComments: saved.plannedSessionOverrides.filter((item) => item.notes?.trim()).length,
    calibrations: saved.calibrations.length
  };
}

export function getExportPreview(): string {
  const data = loadData();
  return JSON.stringify(
    {
      lastUpdate: data.appUpdatedAt || "non renseigné",
      settings: data.settings,
      sessions: data.sessions.length,
      meals: data.meals.length,
      favoriteMeals: data.favoriteMeals.length,
      weights: data.weights.length,
      dailyHabits: data.dailyHabits.length,
      sessionExerciseLogs: data.sessionExerciseLogs.length,
      planningComments: data.plannedSessionOverrides.filter((item) => item.notes?.trim()).length,
      calibrations: data.calibrations.length
    },
    null,
    2
  );
}
