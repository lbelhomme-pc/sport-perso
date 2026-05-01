import type { CompletedSession, EnergyLevel, Meal, PlannedSession, Settings } from "../types";
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

export function estimateNeatCaloriesFromFloors(floors: number, bodyWeightKg: number): number {
  const safeFloors = Math.max(0, floors);
  const safeWeight = Math.max(1, bodyWeightKg);
  return Math.round(safeFloors * safeWeight * 0.02);
}

export function estimateNeatCalories(steps: number, floors: number, bodyWeightKg: number): number {
  return estimateNeatCaloriesFromSteps(steps, bodyWeightKg) + estimateNeatCaloriesFromFloors(floors, bodyWeightKg);
}

export function estimateCaloriesFromSession(type: CompletedSession["type"], durationMin: number): number {
  const caloriesPerMinute = {
    badminton: 8,
    racket: 8,
    strength: 7,
    run: 11,
    bike: 8,
    swim: 9,
    hybrid: 11,
    hyrox: 12,
    mobility: 3,
    recovery: 4,
    test: 10,
    free: 6,
    other: 6
  };

  return Math.round((caloriesPerMinute[type] ?? 6) * durationMin);
}

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
  floors?: number;
  bodyWeightKg?: number;
}) {
  const sportCalories = getSportCalories(args.sessions ?? []);
  const activityFuel = sportCalories > 0 ? Math.round(sportCalories * 0.6) : 0;
  const energyLevel = args.energyLevel ?? "normal";
  const feelingFuel = energyFuelAdjustment[energyLevel];
  const bodyWeightKg = args.bodyWeightKg ?? args.settings.defaultBodyWeight;
  const basalMetabolicRate = calculateBasalMetabolicRate(args.settings, bodyWeightKg);
  const stepsNeatCalories = estimateNeatCaloriesFromSteps(args.steps ?? 0, bodyWeightKg);
  const floorsNeatCalories = estimateNeatCaloriesFromFloors(args.floors ?? 0, bodyWeightKg);
  const neatCalories = stepsNeatCalories + floorsNeatCalories;
  const maintenanceTarget = basalMetabolicRate + activityFuel + feelingFuel + neatCalories;
  const targetDeficit = args.settings.targetDailyDeficit;
  const target = maintenanceTarget - targetDeficit;
  const activityLabel =
    sportCalories > 0
      ? `Sport validé : +${activityFuel} kcal`
      : args.plannedSession
        ? "Séance prévue non comptée tant qu'elle n'est pas validée"
        : "Aucune séance validée : +0 kcal";

  return {
    base: basalMetabolicRate,
    maintenanceTarget,
    targetDeficit,
    target,
    activityFuel,
    feelingFuel,
    stepsNeatCalories,
    floorsNeatCalories,
    neatCalories,
    activityLabel,
    feelingLabel: energyLabels[energyLevel],
    shortReason: `Métabolisme basal ${basalMetabolicRate} kcal + sport validé ${activityFuel} + pas ${stepsNeatCalories} + étages ${floorsNeatCalories} + ressenti ${feelingFuel} - déficit ${targetDeficit} = objectif ${target} kcal`
  };
}
