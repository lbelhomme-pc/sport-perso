import type { Meal } from "../types";
import { deleteMeal, upsertMeal } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useMeals() {
  const data = useStoredData();
  const meals = [...data.meals].sort((a, b) => b.date.localeCompare(a.date));

  return {
    meals,
    saveMeal: (meal: Meal) => upsertMeal(meal),
    deleteMeal
  };
}
