import type { Meal } from "../types";

export function getMealsForDate(meals: Meal[], date: string): Meal[] {
  return meals.filter((meal) => meal.date === date);
}

export function getMealTotals(meals: Meal[]) {
  return meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getProteinTarget(bodyWeight: number, proteinPerKg: number): number {
  return Math.round(bodyWeight * proteinPerKg);
}

export function getMacroProgress(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}
