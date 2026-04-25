import type { FoodProduct } from "./openFoodFactsService";

export type FavoriteFood = FoodProduct & {
  favoriteCategory: string;
  addedAt: string;
};

const FAVORITE_FOODS_KEY = "hyrox-prep-tracker:favorite-foods:v1";
const FAVORITE_FOODS_EVENT = "hyrox-prep-tracker:favorite-foods";

function emitFavoriteFoodsChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITE_FOODS_EVENT));
  }
}

export function loadFavoriteFoods(): FavoriteFood[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FAVORITE_FOODS_KEY);
    return raw ? (JSON.parse(raw) as FavoriteFood[]) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteFood(product: FoodProduct, favoriteCategory: string): FavoriteFood[] {
  const favorite: FavoriteFood = {
    ...product,
    favoriteCategory,
    addedAt: new Date().toISOString()
  };
  const existing = loadFavoriteFoods();
  const withoutDuplicate = existing.filter(
    (item) => !(item.code === favorite.code && item.favoriteCategory === favorite.favoriteCategory)
  );
  const next = [favorite, ...withoutDuplicate];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(FAVORITE_FOODS_KEY, JSON.stringify(next));
    emitFavoriteFoodsChange();
  }

  return next;
}

export function deleteFavoriteFood(code: string, favoriteCategory: string): FavoriteFood[] {
  const next = loadFavoriteFoods().filter(
    (item) => !(item.code === code && item.favoriteCategory === favoriteCategory)
  );

  if (typeof window !== "undefined") {
    window.localStorage.setItem(FAVORITE_FOODS_KEY, JSON.stringify(next));
    emitFavoriteFoodsChange();
  }

  return next;
}

export function subscribeFavoriteFoods(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(FAVORITE_FOODS_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(FAVORITE_FOODS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
