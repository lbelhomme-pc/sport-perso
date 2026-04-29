export type PlannedSessionType = "rest" | "badminton" | "strength" | "run" | "hyrox" | "recovery";

export type CompletedSessionType =
  | "badminton"
  | "strength"
  | "run"
  | "hyrox"
  | "recovery"
  | "other";

export type MealType = "breakfast" | "lunch" | "snack" | "dinner" | "other";

export type MealQuantityUnit = "g" | "ml" | "dose";

export type BadmintonVariant =
  | "twoBadTueWed"
  | "twoBadTueThu"
  | "twoBadTueFri"
  | "twoBadWedThu"
  | "twoBadWedFri"
  | "twoBadThuFri"
  | "threeBadTueWedThu"
  | "threeBadTueWedFri"
  | "threeBadTueThuFri"
  | "threeBadWedThuFri";

export type EnergyLevel = "fatigue" | "normal" | "strong";

export type BmrSex = "male" | "female";

export type DailyHabitType = "allergies" | "duolingo" | "omega3" | "creatine";

export type DailyContext = {
  date: string;
  energyLevel: EnergyLevel;
  steps?: number;
  floors?: number;
  updatedAt?: string;
};

export type DailyHabitEntry = {
  date: string;
  type: DailyHabitType;
  completed: boolean;
  updatedAt?: string;
};

export type SessionChecklistItem = {
  id: string;
  group: string;
  label: string;
};

export type SessionChecklistState = {
  plannedSessionId: string;
  checkedItemIds: string[];
  updatedAt: string;
};

export type ExercisePrescription = {
  id: string;
  block: string;
  name: string;
  order: number;
  sets?: number;
  reps?: number;
  repsText?: string;
  distanceM?: number;
  durationSec?: number;
  targetLoadKg?: number;
  targetLoadText?: string;
  loadMode?: "bodyweight" | "fixed" | "rpe" | "percentCalibration" | "raceLoad";
  percentCalibration?: number;
  restSec?: number;
  restText?: string;
  rpeTarget?: string;
  techniqueNotes?: string[];
  fatigueAdjustment?: string;
  strongAdjustment?: string;
};

export type CompletedExerciseEntry = {
  prescriptionId?: string;
  name: string;
  setsDone?: number;
  repsDone?: number;
  distanceDoneM?: number;
  loadKg?: number;
  restSec?: number;
  rpe?: number;
  doneText?: string;
  notes?: string;
  completed: boolean;
};

export type SessionExerciseLog = {
  plannedSessionId: string;
  exerciseId: string;
  loadKg?: number;
  doneText?: string;
  notes?: string;
  updatedAt?: string;
};

export type ExerciseCalibration = {
  id: string;
  exerciseName: string;
  date: string;
  loadKg?: number;
  distanceM?: number;
  reps?: number;
  timeSec?: number;
  rpe?: number;
  notes?: string;
  updatedAt?: string;
};

export type PlannedSessionOverride = {
  plannedSessionId: string;
  date: string;
  title?: string;
  type?: PlannedSessionType;
  durationMin?: number;
  objective?: string;
  exercises?: ExercisePrescription[];
  notes?: string;
  updatedAt: string;
};

export type Settings = {
  targetDate: string;
  startDate: string;
  startWeight: number;
  targetWeightLoss: number;
  proteinPerKg: number;
  heightCm: number;
  age: number;
  sex: BmrSex;
  useCalculatedBmr: boolean;
  dailyCalorieTarget: number;
  targetDailyDeficit: number;
  defaultBodyWeight: number;
  badmintonVariant: BadmintonVariant;
  vacationWeeks: number[];
  updatedAt?: string;
};

export type PlannedSession = {
  id: string;
  week: number;
  day: string;
  date: string;
  type: PlannedSessionType;
  title: string;
  objective: string;
  durationMin: number;
  rpeTarget: string;
  fatigueVersion: string;
  normalVersion: string;
  strongVersion: string;
  tags: string[];
  exercises?: ExercisePrescription[];
  isEditable?: boolean;
};

export type CompletedSession = {
  id: string;
  plannedSessionId?: string;
  date: string;
  type: CompletedSessionType;
  title: string;
  durationMin: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  caloriesBurned?: number;
  rpe?: number;
  notes?: string;
  completed: boolean;
  exercises?: CompletedExerciseEntry[];
  updatedAt?: string;
};

export type Meal = {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  source?: "manual" | "openfoodfacts" | "common";
  foodCode?: string;
  foodName?: string;
  brand?: string;
  quantityInput?: number;
  quantityUnit?: MealQuantityUnit;
  quantityGrams?: number;
  servingQuantityGrams?: number;
  foodCalories100g?: number;
  foodProtein100g?: number;
  foodCarbs100g?: number;
  foodFat100g?: number;
  items?: MealFoodItem[];
  updatedAt?: string;
};

export type MealFoodItem = {
  id: string;
  source: "openfoodfacts" | "common" | "manual";
  foodCode?: string;
  foodName: string;
  brand?: string;
  quantityInput?: number;
  quantityUnit?: MealQuantityUnit;
  quantityGrams: number;
  servingQuantityGrams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foodCalories100g?: number;
  foodProtein100g?: number;
  foodCarbs100g?: number;
  foodFat100g?: number;
};

export type FavoriteMeal = {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  items?: MealFoodItem[];
  createdAt: string;
  updatedAt?: string;
};

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
  notes?: string;
  updatedAt?: string;
};

export type AppData = {
  appUpdatedAt: string;
  settings: Settings;
  sessions: CompletedSession[];
  meals: Meal[];
  favoriteMeals: FavoriteMeal[];
  weights: WeightEntry[];
  dailyContexts: DailyContext[];
  dailyHabits: DailyHabitEntry[];
  sessionExerciseLogs: SessionExerciseLog[];
  sessionChecklists: SessionChecklistState[];
  plannedSessionOverrides: PlannedSessionOverride[];
  calibrations: ExerciseCalibration[];
};

export type TrainingPhase = {
  key: string;
  from: number;
  to: number;
  title: string;
  summary: string;
  focus: string;
};

export type DayTemplate = {
  day: string;
  slot: "rest" | "badminton" | "strength" | "run" | "hyrox" | "recovery";
  note?: string;
};

export type DayTotals = {
  date: string;
  caloriesIn: number;
  caloriesOut: number;
  protein: number;
  carbs: number;
  fat: number;
  balance: number;
};

export type WeekSummary = {
  week: number;
  planned: number;
  completed: number;
  badminton: number;
  strength: number;
  volumeMin: number;
  sportCalories: number;
};

export type DashboardAlert = {
  id: string;
  tone: "info" | "warning" | "danger" | "success";
  title: string;
  message: string;
};
