import type { FoodProduct } from "./openFoodFactsService";

export type FavoriteFood = FoodProduct & {
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
    const parsed = raw ? (JSON.parse(raw) as Array<FavoriteFood & { favoriteCategory?: string }>) : [];
    const seen = new Set<string>();
    return parsed
      .filter((item) => {
        if (seen.has(item.code)) return false;
        seen.add(item.code);
        return true;
      })
      .map(({ favoriteCategory: _favoriteCategory, addedAt, ...product }) => ({
        ...product,
        addedAt: addedAt ?? new Date().toISOString()
      }));
  } catch {
    return [];
  }
}

export function saveFavoriteFood(product: FoodProduct): FavoriteFood[] {
  const favorite: FavoriteFood = {
    ...product,
    addedAt: new Date().toISOString()
  };
  const existing = loadFavoriteFoods();
  const withoutDuplicate = existing.filter((item) => item.code !== favorite.code);
  const next = [favorite, ...withoutDuplicate];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(FAVORITE_FOODS_KEY, JSON.stringify(next));
    emitFavoriteFoodsChange();
  }

  return next;
}

export function deleteFavoriteFood(code: string): FavoriteFood[] {
  const next = loadFavoriteFoods().filter((item) => item.code !== code);

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
