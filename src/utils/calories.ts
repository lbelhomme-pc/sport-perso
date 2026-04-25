import type { CompletedSession, EnergyLevel, Meal, PlannedSession, PlannedSessionType, Settings } from "../types";
import { getMealTotals } from "./nutrition";

export function getSportCalories(sessions: CompletedSession[]): number {
  return sessions.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
}

export function getDailyBalance(settings: Settings, meals: Meal[], sessions: CompletedSession[], calorieTarget?: number): number {
  const eaten = getMealTotals(meals).calories;
  return eaten - (calorieTarget ?? settings.dailyCalorieTarget);
}

export function getRemainingCaloriesToTarget(meals: Meal[], calorieTarget: number): number {
  const eaten = getMealTotals(meals).calories;
  return Math.round(calorieTarget - eaten);
}

export function getDailyDeficit(meals: Meal[], maintenanceCalorieTarget: number): number {
  const eaten = getMealTotals(meals).calories;
  return Math.round(maintenanceCalorieTarget - eaten);
}

export function calculateBasalMetabolicRate(settings: Settings, bodyWeightKg?: number): number {
  if (!settings.useCalculatedBmr) return Math.round(settings.dailyCalorieTarget);

  const weight = Math.max(1, bodyWeightKg ?? settings.defaultBodyWeight);
  const height = Math.max(1, settings.heightCm);
  const age = Math.max(1, settings.age);
  const sexAdjustment = settings.sex === "male" ? 5 : -161;

  return Math.round(10 * weight + 6.25 * height - 5 * age + sexAdjustment);
}

export function estimateNeatCaloriesFromSteps(steps: number, bodyWeightKg: number): number {
  const safeSteps = Math.max(0, steps);
  const safeWeight = Math.max(1, bodyWeightKg);
  return Math.round(safeSteps * safeWeight * 0.0004);
}

export function estimateCaloriesFromSession(type: CompletedSession["type"], durationMin: number): number {
  const caloriesPerMinute = {
    badminton: 8,
    strength: 7,
    run: 11,
    hyrox: 12,
    recovery: 4,
    other: 6
  };

  return Math.round((caloriesPerMinute[type] ?? 6) * durationMin);
}

const plannedActivityFuel: Record<PlannedSessionType, number> = {
  rest: 0,
  badminton: 300,
  strength: 250,
  run: 350,
  hyrox: 500,
  recovery: 100
};

const energyFuelAdjustment: Record<EnergyLevel, number> = {
  fatigue: 150,
  normal: 0,
  strong: 75
};

const energyLabels: Record<EnergyLevel, string> = {
  fatigue: "Fatigué : récupération prioritaire",
  normal: "Normal : cible standard",
  strong: "En forme : marge énergie légère"
};

export function getAdaptiveDailyCalorieTarget(args: {
  settings: Settings;
  plannedSession?: PlannedSession;
  sessions?: CompletedSession[];
  energyLevel?: EnergyLevel;
  steps?: number;
  bodyWeightKg?: number;
}) {
  const sportCalories = getSportCalories(args.sessions ?? []);
  const plannedFuel = args.plannedSession ? plannedActivityFuel[args.plannedSession.type] : 0;
  const activityFuel = sportCalories > 0 ? Math.round(sportCalories * 0.6) : plannedFuel;
  const energyLevel = args.energyLevel ?? "normal";
  const feelingFuel = energyFuelAdjustment[energyLevel];
  const bodyWeightKg = args.bodyWeightKg ?? args.settings.defaultBodyWeight;
  const basalMetabolicRate = calculateBasalMetabolicRate(args.settings, bodyWeightKg);
  const neatCalories = estimateNeatCaloriesFromSteps(args.steps ?? 0, bodyWeightKg);
  const maintenanceTarget = basalMetabolicRate + activityFuel + feelingFuel + neatCalories;
  const targetDeficit = args.settings.targetDailyDeficit;
  const target = maintenanceTarget - targetDeficit;
  const activityLabel =
    sportCalories > 0
      ? `Sport saisi : +${activityFuel} kcal`
      : args.plannedSession
        ? `${args.plannedSession.title} : +${activityFuel} kcal`
        : "Pas de séance prévue : +0 kcal";

  return {
    base: basalMetabolicRate,
    maintenanceTarget,
    targetDeficit,
    target,
    activityFuel,
    feelingFuel,
    neatCalories,
    activityLabel,
    feelingLabel: energyLabels[energyLevel],
    shortReason: `Métabolisme basal ${basalMetabolicRate} kcal + activité ${activityFuel} + pas ${neatCalories} + ressenti ${feelingFuel} - déficit ${targetDeficit} = objectif ${target} kcal`
  };
}
