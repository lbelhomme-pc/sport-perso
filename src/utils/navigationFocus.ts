import type { NavigationFocus } from "../types";

export function wantsSport(focus: NavigationFocus = "both") {
  return focus !== "nutrition";
}

export function wantsNutrition(focus: NavigationFocus = "both") {
  return focus !== "sport";
}
