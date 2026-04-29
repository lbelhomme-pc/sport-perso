import { MEAL_TYPE_LABELS } from "../data/defaults";
import { deleteFavoriteMeal, makeId, upsertFavoriteMeal } from "../services/storageService";
import type { FavoriteMeal, Meal, MealFoodItem } from "../types";
import { useStoredData } from "./useStoredData";

function cloneMealItems(items?: MealFoodItem[]): MealFoodItem[] | undefined {
  return items?.map((item) => ({
    ...item,
    id: makeId("food")
  }));
}

function rounded(value: number) {
  return Math.round(value * 10) / 10;
}

export function favoriteMealFromMeal(meal: Meal, name: string): FavoriteMeal {
  const now = new Date().toISOString();

  return {
    id: makeId("favorite-meal"),
    name: name.trim(),
    mealType: meal.mealType,
    calories: Math.round(meal.calories),
    protein: rounded(meal.protein),
    carbs: rounded(meal.carbs),
    fat: rounded(meal.fat),
    notes: meal.notes,
    items: cloneMealItems(meal.items),
    createdAt: now,
    updatedAt: now
  };
}

export function mealFromFavoriteMeal(favorite: FavoriteMeal, date: string): Meal {
  const items = cloneMealItems(favorite.items);
  const firstItem = items?.length === 1 ? items[0] : undefined;

  return {
    id: makeId("meal"),
    date,
    mealType: favorite.mealType,
    name: MEAL_TYPE_LABELS[favorite.mealType],
    calories: Math.round(favorite.calories),
    protein: rounded(favorite.protein),
    carbs: rounded(favorite.carbs),
    fat: rounded(favorite.fat),
    notes: favorite.notes,
    source: firstItem?.source,
    foodCode: firstItem?.foodCode,
    foodName: firstItem?.foodName,
    brand: firstItem?.brand,
    quantityInput: firstItem?.quantityInput,
    quantityUnit: firstItem?.quantityUnit,
    quantityGrams: firstItem?.quantityGrams,
    servingQuantityGrams: firstItem?.servingQuantityGrams,
    foodCalories100g: firstItem?.foodCalories100g,
    foodProtein100g: firstItem?.foodProtein100g,
    foodCarbs100g: firstItem?.foodCarbs100g,
    foodFat100g: firstItem?.foodFat100g,
    items,
    updatedAt: new Date().toISOString()
  };
}

export function useFavoriteMeals() {
  const data = useStoredData();
  const favoriteMeals = [...data.favoriteMeals].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt || "");
    const bTime = Date.parse(b.updatedAt || b.createdAt || "");
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });

  return {
    favoriteMeals,
    saveFavoriteMeal: (favorite: FavoriteMeal) => upsertFavoriteMeal(favorite),
    deleteFavoriteMeal,
    saveFavoriteFromMeal: (meal: Meal, name: string) => upsertFavoriteMeal(favoriteMealFromMeal(meal, name)),
    createMealFromFavorite: mealFromFavoriteMeal
  };
}
