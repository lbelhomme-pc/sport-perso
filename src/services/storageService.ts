import { z } from "zod";
import { DEFAULT_SETTINGS } from "../data/defaults";
import type {
  AppData,
  CompletedSession,
  DailyContext,
  DailyHabitEntry,
  DailyHabitType,
  ExerciseCalibration,
  Meal,
  PlannedSessionOverride,
  SessionExerciseLog,
  Settings,
  WeightEntry
} from "../types";

const STORAGE_KEY = "hyrox-prep-tracker:data:v1";
const STORAGE_EVENT = "hyrox-prep-tracker:storage";

const settingsSchema = z.object({
  targetDate: z.string().default(DEFAULT_SETTINGS.targetDate),
  startDate: z.string().default(DEFAULT_SETTINGS.startDate),
  startWeight: z.coerce.number().positive().default(DEFAULT_SETTINGS.startWeight),
  targetWeightLoss: z.coerce.number().positive().default(DEFAULT_SETTINGS.targetWeightLoss),
  proteinPerKg: z.coerce.number().positive().default(DEFAULT_SETTINGS.proteinPerKg),
  heightCm: z.coerce.number().positive().default(DEFAULT_SETTINGS.heightCm),
  age: z.coerce.number().positive().default(DEFAULT_SETTINGS.age),
  sex: z.enum(["male", "female"]).default(DEFAULT_SETTINGS.sex),
  useCalculatedBmr: z.boolean().default(DEFAULT_SETTINGS.useCalculatedBmr),
  dailyCalorieTarget: z.coerce.number().positive().default(DEFAULT_SETTINGS.dailyCalorieTarget),
  targetDailyDeficit: z.coerce.number().nonnegative().default(DEFAULT_SETTINGS.targetDailyDeficit),
  defaultBodyWeight: z.coerce.number().positive().default(DEFAULT_SETTINGS.defaultBodyWeight),
  vacationWeeks: z.array(z.coerce.number().int().positive()).default(DEFAULT_SETTINGS.vacationWeeks),
  updatedAt: z.string().optional()
});

const completedExerciseEntrySchema = z.object({
  prescriptionId: z.string().optional(),
  name: z.string(),
  setsDone: z.coerce.number().optional(),
  repsDone: z.coerce.number().optional(),
  distanceDoneM: z.coerce.number().optional(),
  loadKg: z.coerce.number().optional(),
  restSec: z.coerce.number().optional(),
  rpe: z.coerce.number().min(0).max(10).optional(),
  doneText: z.string().optional(),
  notes: z.string().optional(),
  completed: z.boolean().default(false)
});

const sessionExerciseLogSchema = z.object({
  plannedSessionId: z.string(),
  exerciseId: z.string(),
  loadKg: z.coerce.number().optional(),
  doneText: z.string().optional(),
  notes: z.string().optional(),
  updatedAt: z.string().optional()
});

const completedSessionSchema = z.object({
  id: z.string(),
  plannedSessionId: z.string().optional(),
  date: z.string(),
  type: z.enum(["badminton", "strength", "run", "hyrox", "recovery", "other"]),
  title: z.string(),
  durationMin: z.coerce.number().nonnegative(),
  averageHeartRate: z.coerce.number().positive().optional(),
  maxHeartRate: z.coerce.number().positive().optional(),
  caloriesBurned: z.coerce.number().nonnegative().optional(),
  rpe: z.coerce.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  completed: z.boolean().default(true),
  exercises: z.array(completedExerciseEntrySchema).optional(),
  updatedAt: z.string().optional()
});

const mealSchema = z.object({
  id: z.string(),
  date: z.string(),
  mealType: z.enum(["breakfast", "lunch", "snack", "dinner", "other"]),
  name: z.string(),
  calories: z.coerce.number().nonnegative(),
  protein: z.coerce.number().nonnegative(),
  carbs: z.coerce.number().nonnegative(),
  fat: z.coerce.number().nonnegative(),
  notes: z.string().optional(),
  source: z.enum(["manual", "openfoodfacts", "common"]).optional(),
  foodCode: z.string().optional(),
  foodName: z.string().optional(),
  brand: z.string().optional(),
  quantityInput: z.coerce.number().nonnegative().optional(),
  quantityUnit: z.enum(["g", "ml", "dose"]).optional(),
  quantityGrams: z.coerce.number().nonnegative().optional(),
  servingQuantityGrams: z.coerce.number().nonnegative().optional(),
  foodCalories100g: z.coerce.number().nonnegative().optional(),
  foodProtein100g: z.coerce.number().nonnegative().optional(),
  foodCarbs100g: z.coerce.number().nonnegative().optional(),
  foodFat100g: z.coerce.number().nonnegative().optional(),
  updatedAt: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        source: z.enum(["manual", "openfoodfacts", "common"]),
        foodCode: z.string().optional(),
        foodName: z.string(),
        brand: z.string().optional(),
        quantityInput: z.coerce.number().nonnegative().optional(),
        quantityUnit: z.enum(["g", "ml", "dose"]).optional(),
        quantityGrams: z.coerce.number().nonnegative(),
        servingQuantityGrams: z.coerce.number().nonnegative().optional(),
        calories: z.coerce.number().nonnegative(),
        protein: z.coerce.number().nonnegative(),
        carbs: z.coerce.number().nonnegative(),
        fat: z.coerce.number().nonnegative(),
        foodCalories100g: z.coerce.number().nonnegative().optional(),
        foodProtein100g: z.coerce.number().nonnegative().optional(),
        foodCarbs100g: z.coerce.number().nonnegative().optional(),
        foodFat100g: z.coerce.number().nonnegative().optional()
      })
    )
    .optional()
});

const weightEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.coerce.number().positive(),
  notes: z.string().optional(),
  updatedAt: z.string().optional()
});

const dailyContextSchema = z.object({
  date: z.string(),
  energyLevel: z.enum(["fatigue", "normal", "strong"]).default("normal"),
  steps: z.coerce.number().nonnegative().default(0),
  updatedAt: z.string().optional()
});

const dailyHabitSchema = z.object({
  date: z.string(),
  type: z.enum(["allergies", "duolingo", "omega3", "creatine"]),
  completed: z.boolean().default(false),
  updatedAt: z.string().optional()
});

const sessionChecklistSchema = z.object({
  plannedSessionId: z.string(),
  checkedItemIds: z.array(z.string()).default([]),
  updatedAt: z.string().default("")
});

const exercisePrescriptionSchema = z.object({
  id: z.string(),
  block: z.string(),
  name: z.string(),
  order: z.coerce.number(),
  sets: z.coerce.number().optional(),
  reps: z.coerce.number().optional(),
  repsText: z.string().optional(),
  distanceM: z.coerce.number().optional(),
  durationSec: z.coerce.number().optional(),
  targetLoadKg: z.coerce.number().optional(),
  targetLoadText: z.string().optional(),
  loadMode: z.enum(["bodyweight", "fixed", "rpe", "percentCalibration", "raceLoad"]).optional(),
  percentCalibration: z.coerce.number().optional(),
  restSec: z.coerce.number().optional(),
  restText: z.string().optional(),
  rpeTarget: z.string().optional(),
  techniqueNotes: z.array(z.string()).optional(),
  fatigueAdjustment: z.string().optional(),
  strongAdjustment: z.string().optional()
});

const exerciseCalibrationSchema = z.object({
  id: z.string(),
  exerciseName: z.string(),
  date: z.string(),
  loadKg: z.coerce.number().optional(),
  distanceM: z.coerce.number().optional(),
  reps: z.coerce.number().optional(),
  timeSec: z.coerce.number().optional(),
  rpe: z.coerce.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  updatedAt: z.string().optional()
});

const plannedSessionOverrideSchema = z.object({
  plannedSessionId: z.string(),
  date: z.string(),
  title: z.string().optional(),
  type: z.enum(["rest", "badminton", "strength", "run", "hyrox", "recovery"]).optional(),
  durationMin: z.coerce.number().nonnegative().optional(),
  objective: z.string().optional(),
  exercises: z.array(exercisePrescriptionSchema).optional(),
  notes: z.string().optional(),
  updatedAt: z.string().default("")
});

const appDataSchema = z.object({
  appUpdatedAt: z.string().default(""),
  settings: settingsSchema.default(DEFAULT_SETTINGS),
  sessions: z.array(completedSessionSchema).default([]),
  meals: z.array(mealSchema).default([]),
  weights: z.array(weightEntrySchema).default([]),
  dailyContexts: z.array(dailyContextSchema).default([]),
  dailyHabits: z.array(dailyHabitSchema).default([]),
  sessionExerciseLogs: z.array(sessionExerciseLogSchema).default([]),
  sessionChecklists: z.array(sessionChecklistSchema).default([]),
  plannedSessionOverrides: z.array(plannedSessionOverrideSchema).default([]),
  calibrations: z.array(exerciseCalibrationSchema).default([])
});

export function createDefaultData(): AppData {
  return {
    appUpdatedAt: "",
    settings: DEFAULT_SETTINGS,
    sessions: [],
    meals: [],
    weights: [],
    dailyContexts: [],
    dailyHabits: [],
    sessionExerciseLogs: [],
    sessionChecklists: [],
    plannedSessionOverrides: [],
    calibrations: []
  };
}

function emitStorageChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  }
}

export function subscribeToStorage(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(STORAGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(STORAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function parseAppData(value: unknown): AppData {
  const parsed = appDataSchema.safeParse(value);

  if (!parsed.success) {
    return createDefaultData();
  }

  return {
    appUpdatedAt: parsed.data.appUpdatedAt,
    settings: {
      ...DEFAULT_SETTINGS,
      ...parsed.data.settings,
      vacationWeeks: [...new Set(parsed.data.settings.vacationWeeks)].sort((a, b) => a - b)
    },
    sessions: parsed.data.sessions,
    meals: parsed.data.meals,
    weights: parsed.data.weights,
    dailyContexts: parsed.data.dailyContexts,
    dailyHabits: parsed.data.dailyHabits,
    sessionExerciseLogs: parsed.data.sessionExerciseLogs,
    sessionChecklists: parsed.data.sessionChecklists,
    plannedSessionOverrides: parsed.data.plannedSessionOverrides,
    calibrations: parsed.data.calibrations
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return createDefaultData();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultData();
  }

  try {
    return parseAppData(JSON.parse(raw));
  } catch {
    return createDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parseAppData(data)));
  emitStorageChange();
}

export function updateData(updater: (data: AppData) => AppData): AppData {
  const updated = { ...updater(loadData()), appUpdatedAt: new Date().toISOString() };
  saveData(updated);
  return updated;
}

export function updateSettings(settings: Settings): AppData {
  return updateData((data) => ({
    ...data,
    settings: parseAppData({ ...data, settings: { ...settings, updatedAt: new Date().toISOString() } }).settings
  }));
}

export function upsertSession(session: CompletedSession): AppData {
  return updateData((data) => {
    const stampedSession = { ...session, updatedAt: new Date().toISOString() };
    const existingIndex = data.sessions.findIndex((item) => item.id === session.id);
    const sessions =
      existingIndex >= 0
        ? data.sessions.map((item) => (item.id === session.id ? stampedSession : item))
        : [stampedSession, ...data.sessions];

    return { ...data, sessions };
  });
}

export function deleteSession(id: string): AppData {
  return updateData((data) => ({ ...data, sessions: data.sessions.filter((item) => item.id !== id) }));
}

export function upsertMeal(meal: Meal): AppData {
  return updateData((data) => {
    const stampedMeal = { ...meal, updatedAt: new Date().toISOString() };
    const existingIndex = data.meals.findIndex((item) => item.id === meal.id);
    const meals =
      existingIndex >= 0 ? data.meals.map((item) => (item.id === meal.id ? stampedMeal : item)) : [stampedMeal, ...data.meals];

    return { ...data, meals };
  });
}

export function deleteMeal(id: string): AppData {
  return updateData((data) => ({ ...data, meals: data.meals.filter((item) => item.id !== id) }));
}

export function upsertWeight(entry: WeightEntry): AppData {
  return updateData((data) => {
    const stampedEntry = { ...entry, updatedAt: new Date().toISOString() };
    const withoutSameDate = data.weights.filter((item) => item.date !== stampedEntry.date || item.id === stampedEntry.id);
    const existingIndex = withoutSameDate.findIndex((item) => item.id === stampedEntry.id);
    const weights =
      existingIndex >= 0
        ? withoutSameDate.map((item) => (item.id === stampedEntry.id ? stampedEntry : item))
        : [stampedEntry, ...withoutSameDate];

    return { ...data, weights };
  });
}

export function deleteWeight(id: string): AppData {
  return updateData((data) => ({ ...data, weights: data.weights.filter((item) => item.id !== id) }));
}

export function upsertDailyContext(context: DailyContext): AppData {
  return updateData((data) => {
    const stampedContext = { ...context, updatedAt: new Date().toISOString() };
    const dailyContexts = data.dailyContexts.some((item) => item.date === stampedContext.date)
      ? data.dailyContexts.map((item) => (item.date === stampedContext.date ? stampedContext : item))
      : [stampedContext, ...data.dailyContexts];

    return { ...data, dailyContexts };
  });
}

export function toggleDailyHabit(date: string, type: DailyHabitType, completed: boolean): AppData {
  return updateData((data) => {
    const entry: DailyHabitEntry = {
      date,
      type,
      completed,
      updatedAt: new Date().toISOString()
    };
    const exists = data.dailyHabits.some((item) => item.date === date && item.type === type);
    const dailyHabits = exists
      ? data.dailyHabits.map((item) => (item.date === date && item.type === type ? entry : item))
      : [entry, ...data.dailyHabits];

    return { ...data, dailyHabits };
  });
}

export function upsertSessionExerciseLog(log: SessionExerciseLog): AppData {
  return updateData((data) => {
    const stampedLog = { ...log, updatedAt: new Date().toISOString() };
    const hasValue = Boolean(stampedLog.loadKg !== undefined || stampedLog.doneText?.trim() || stampedLog.notes?.trim());
    const exists = data.sessionExerciseLogs.some(
      (item) => item.plannedSessionId === stampedLog.plannedSessionId && item.exerciseId === stampedLog.exerciseId
    );
    const sessionExerciseLogs = hasValue
      ? exists
        ? data.sessionExerciseLogs.map((item) =>
            item.plannedSessionId === stampedLog.plannedSessionId && item.exerciseId === stampedLog.exerciseId
              ? stampedLog
              : item
          )
        : [stampedLog, ...data.sessionExerciseLogs]
      : data.sessionExerciseLogs.filter(
          (item) => !(item.plannedSessionId === stampedLog.plannedSessionId && item.exerciseId === stampedLog.exerciseId)
        );

    return { ...data, sessionExerciseLogs };
  });
}

export function saveSessionChecklist(plannedSessionId: string, checkedItemIds: string[]): AppData {
  return updateData((data) => {
    const uniqueIds = [...new Set(checkedItemIds)];
    const entry = {
      plannedSessionId,
      checkedItemIds: uniqueIds,
      updatedAt: new Date().toISOString()
    };
    const sessionChecklists = data.sessionChecklists.some((item) => item.plannedSessionId === plannedSessionId)
      ? data.sessionChecklists.map((item) => (item.plannedSessionId === plannedSessionId ? entry : item))
      : [entry, ...data.sessionChecklists];

    return { ...data, sessionChecklists };
  });
}

export function toggleSessionChecklistItem(plannedSessionId: string, itemId: string, checked: boolean): AppData {
  return updateData((data) => {
    const existing = data.sessionChecklists.find((item) => item.plannedSessionId === plannedSessionId);
    const currentIds = new Set(existing?.checkedItemIds ?? []);

    if (checked) {
      currentIds.add(itemId);
    } else {
      currentIds.delete(itemId);
    }

    const entry = {
      plannedSessionId,
      checkedItemIds: [...currentIds],
      updatedAt: new Date().toISOString()
    };
    const sessionChecklists = existing
      ? data.sessionChecklists.map((item) => (item.plannedSessionId === plannedSessionId ? entry : item))
      : [entry, ...data.sessionChecklists];

    return { ...data, sessionChecklists };
  });
}

export function resetSessionChecklist(plannedSessionId: string): AppData {
  return updateData((data) => ({
    ...data,
    sessionChecklists: data.sessionChecklists.filter((item) => item.plannedSessionId !== plannedSessionId)
  }));
}

export function upsertPlannedSessionOverride(override: PlannedSessionOverride): AppData {
  return updateData((data) => {
    const cleanOverride = {
      ...override,
      notes: override.notes?.trim() ? override.notes : undefined,
      updatedAt: new Date().toISOString()
    };
    const hasUsefulValue = Boolean(
      cleanOverride.title ||
        cleanOverride.type ||
        cleanOverride.durationMin !== undefined ||
        cleanOverride.objective ||
        cleanOverride.exercises?.length ||
        cleanOverride.notes
    );
    const existing = data.plannedSessionOverrides.some((item) => item.plannedSessionId === override.plannedSessionId);
    const plannedSessionOverrides = hasUsefulValue
      ? existing
        ? data.plannedSessionOverrides.map((item) =>
            item.plannedSessionId === override.plannedSessionId ? cleanOverride : item
          )
        : [cleanOverride, ...data.plannedSessionOverrides]
      : data.plannedSessionOverrides.filter((item) => item.plannedSessionId !== override.plannedSessionId);

    return { ...data, plannedSessionOverrides };
  });
}

export function deletePlannedSessionOverride(plannedSessionId: string): AppData {
  return updateData((data) => ({
    ...data,
    plannedSessionOverrides: data.plannedSessionOverrides.filter((item) => item.plannedSessionId !== plannedSessionId)
  }));
}

export function upsertCalibration(calibration: ExerciseCalibration): AppData {
  return updateData((data) => {
    const stampedCalibration = { ...calibration, updatedAt: new Date().toISOString() };
    const existing = data.calibrations.some((item) => item.id === stampedCalibration.id);
    const calibrations = existing
      ? data.calibrations.map((item) => (item.id === stampedCalibration.id ? stampedCalibration : item))
      : [stampedCalibration, ...data.calibrations];

    return { ...data, calibrations };
  });
}

export function deleteCalibration(id: string): AppData {
  return updateData((data) => ({ ...data, calibrations: data.calibrations.filter((item) => item.id !== id) }));
}

export function replaceData(data: AppData): AppData {
  const parsed = parseAppData(data);
  saveData(parsed);
  return parsed;
}

export function resetData(): AppData {
  const data = createDefaultData();
  saveData(data);
  return data;
}

export function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
