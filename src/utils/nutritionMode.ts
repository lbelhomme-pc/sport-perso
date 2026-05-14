import type { AppModuleId, NutritionTrackingMode, Settings } from "../types";

export function getNutritionMode(settings: Settings): NutritionTrackingMode {
  return settings.nutritionMode ?? "calories-macros";
}

export function hasNutritionModule(settings: Settings) {
  return getNutritionMode(settings) !== "disabled";
}

export function tracksNutritionNumbers(settings: Settings) {
  if (settings.eatingDisorderHistory) return false;
  return ["calories-macros", "advanced", "performance", "fat-loss-prudent", "muscle-gain"].includes(getNutritionMode(settings));
}

export function tracksNutritionQuality(settings: Settings) {
  return getNutritionMode(settings) !== "disabled";
}

export function getNutritionModeLabel(mode: NutritionTrackingMode) {
  const labels: Record<NutritionTrackingMode, string> = {
    disabled: "Désactivée",
    simple: "Simple",
    "no-calories": "Sans calories",
    "calories-macros": "Calories/macros",
    advanced: "Avancé",
    performance: "Performance",
    "fat-loss-prudent": "Perte prudente",
    "muscle-gain": "Prise de muscle"
  };

  return labels[mode];
}

export function getNutritionModeGuidance(mode: NutritionTrackingMode) {
  const guidance: Record<NutritionTrackingMode, string> = {
    disabled: "Aucune carte repas, calorie, macro ou raccourci nutrition visible.",
    simple: "Protéines, fruits/légumes, eau et contexte des repas, sans pression chiffrée.",
    "no-calories": "Portions, qualité, timing autour séance et hydratation, sans calories.",
    "calories-macros": "Calories, protéines, glucides et lipides avec détails repliés.",
    advanced: "Calories, macros, fibres, favoris et tendances utiles.",
    performance: "Glucides avant/après séance, protéines et récupération.",
    "fat-loss-prudent": "Déficit modéré, faim, fatigue, sommeil et récupération surveillés.",
    "muscle-gain": "Protéines, léger surplus, régularité et progression des charges."
  };

  return guidance[mode];
}

export function applyNutritionModeToModules(
  mode: NutritionTrackingMode,
  enabledModules: AppModuleId[],
  primaryModuleTabs: AppModuleId[]
) {
  if (mode === "disabled") {
    return {
      enabledModules: enabledModules.filter((moduleId) => moduleId !== "nutrition"),
      primaryModuleTabs: primaryModuleTabs.filter((moduleId) => moduleId !== "nutrition")
    };
  }

  const nextEnabled = enabledModules.includes("nutrition") ? enabledModules : [...enabledModules, "nutrition" as AppModuleId];

  return {
    enabledModules: nextEnabled,
    primaryModuleTabs
  };
}
