import {
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  Dumbbell,
  HeartPulse,
  Home,
  Scale,
  Settings as SettingsIcon,
  Utensils
} from "lucide-react";
import type { AppExperienceMode, AppModuleId, NavigationFocus, Settings as AppSettings } from "../types";

export type AppModuleConfig = {
  id: AppModuleId;
  label: string;
  shortLabel: string;
  description: string;
  route: string;
  defaultEnabled: boolean;
  canBeMainTab: boolean;
  icon: typeof Home;
};

export type ModulePreferences = {
  enabledModules: AppModuleId[];
  primaryModuleTabs: AppModuleId[];
};

export const MAX_PRIMARY_TABS = 6;

export const modulesConfig: Record<AppModuleId, AppModuleConfig> = {
  home: {
    id: "home",
    label: "Jour",
    shortLabel: "Jour",
    description: "Aujourd'hui, action principale et rappels utiles.",
    route: "/",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: Home
  },
  training: {
    id: "training",
    label: "Programme",
    shortLabel: "Prog.",
    description: "Choisir et préparer les séances de la semaine.",
    route: "/planning",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: CalendarDays
  },
  sessions: {
    id: "sessions",
    label: "Séances",
    shortLabel: "Sport",
    description: "Historique, saisie libre, durée, RPE, FC et notes.",
    route: "/sessions",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: Dumbbell
  },
  nutrition: {
    id: "nutrition",
    label: "Repas",
    shortLabel: "Repas",
    description: "Repas, protéines, favoris et suivi alimentaire si activé.",
    route: "/meals",
    defaultEnabled: false,
    canBeMainTab: true,
    icon: Utensils
  },
  calendar: {
    id: "calendar",
    label: "Calendrier",
    shortLabel: "Cal.",
    description: "Vue jour par jour : sport, repas et mouvement si actifs.",
    route: "/calendar",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: CalendarCheck2
  },
  progress: {
    id: "progress",
    label: "Stats",
    shortLabel: "Stats",
    description: "Tendances utiles pour décider quoi ajuster.",
    route: "/stats",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: BarChart3
  },
  weight: {
    id: "weight",
    label: "Poids",
    shortLabel: "Poids",
    description: "Pesées, tendance et objectif de composition corporelle.",
    route: "/weight",
    defaultEnabled: false,
    canBeMainTab: true,
    icon: Scale
  },
  recovery: {
    id: "recovery",
    label: "Récupération",
    shortLabel: "Récup.",
    description: "Fatigue, sommeil, douleur et signaux de récupération.",
    route: "/recovery",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: HeartPulse
  },
  profile: {
    id: "profile",
    label: "Plus",
    shortLabel: "Plus",
    description: "Objectifs, préférences, modules, export et installation PWA.",
    route: "/settings",
    defaultEnabled: true,
    canBeMainTab: true,
    icon: SettingsIcon
  }
};

export const moduleOrder = Object.keys(modulesConfig) as AppModuleId[];

export const recommendedModulesByGoal: Record<AppExperienceMode | "free", { enabled: AppModuleId[]; tabs: AppModuleId[] }> = {
  competition: {
    enabled: ["home", "training", "sessions", "calendar", "progress", "recovery", "profile"],
    tabs: ["home", "training", "sessions", "progress", "profile"]
  },
  "weight-loss": {
    enabled: ["home", "training", "sessions", "nutrition", "weight", "progress", "profile"],
    tabs: ["home", "training", "nutrition", "progress", "profile"]
  },
  fitness: {
    enabled: ["home", "training", "sessions", "calendar", "recovery", "progress", "profile"],
    tabs: ["home", "training", "sessions", "recovery", "profile"]
  },
  "muscle-gain": {
    enabled: ["home", "training", "sessions", "nutrition", "progress", "recovery", "profile"],
    tabs: ["home", "training", "sessions", "nutrition", "profile"]
  },
  performance: {
    enabled: ["home", "training", "sessions", "calendar", "progress", "recovery", "profile"],
    tabs: ["home", "training", "sessions", "progress", "profile"]
  },
  hybrid: {
    enabled: ["home", "training", "sessions", "calendar", "progress", "recovery", "profile"],
    tabs: ["home", "training", "sessions", "progress", "profile"]
  },
  racket: {
    enabled: ["home", "training", "sessions", "calendar", "progress", "recovery", "profile"],
    tabs: ["home", "training", "sessions", "progress", "profile"]
  },
  health: {
    enabled: ["home", "training", "sessions", "calendar", "recovery", "progress", "profile"],
    tabs: ["home", "training", "recovery", "progress", "profile"]
  },
  free: {
    enabled: ["home", "training", "sessions", "nutrition", "progress", "recovery", "profile"],
    tabs: ["home", "training", "nutrition", "progress", "profile"]
  }
};

function uniqueModules(modules: AppModuleId[]) {
  return moduleOrder.filter((moduleId) => modules.includes(moduleId));
}

function uniqueModulesInOrder(modules: AppModuleId[]) {
  const seen = new Set<AppModuleId>();

  return modules.filter((moduleId) => {
    if (seen.has(moduleId) || !modulesConfig[moduleId]) return false;
    seen.add(moduleId);
    return true;
  });
}

function fallbackModulesFromFocus(focus: NavigationFocus = "both") {
  if (focus === "sport") return recommendedModulesByGoal.competition;
  if (focus === "nutrition") {
    return {
      enabled: ["home", "nutrition", "weight", "calendar", "progress", "profile"] as AppModuleId[],
      tabs: ["home", "nutrition", "weight", "progress", "profile"] as AppModuleId[]
    };
  }
  return {
    enabled: DEFAULT_MODULES_ENABLED,
    tabs: DEFAULT_PRIMARY_TABS
  };
}

export const DEFAULT_MODULES_ENABLED = ["home", "training", "sessions", "calendar", "progress", "recovery", "profile"] as AppModuleId[];
export const DEFAULT_PRIMARY_TABS = ["home", "training", "sessions", "progress", "profile"] as AppModuleId[];
export const MAIN_NAVIGATION_ORDER = ["home", "training", "sessions", "progress", "profile"] as AppModuleId[];

function applyModuleGuards(settings: AppSettings, modules: AppModuleId[]) {
  const nutritionMode = settings.nutritionMode ?? "calories-macros";
  const withoutNutrition = nutritionMode === "disabled" ? modules.filter((moduleId) => moduleId !== "nutrition") : modules;
  const guarded = settings.eatingDisorderHistory
    ? withoutNutrition.filter((moduleId) => moduleId !== "weight")
    : withoutNutrition;

  return guarded;
}

export function resolveModulePreferences(settings: AppSettings): ModulePreferences {
  const fallback = fallbackModulesFromFocus(settings.navigationFocus);
  const enabled = uniqueModules(applyModuleGuards(settings, settings.enabledModules?.length ? settings.enabledModules : fallback.enabled));
  const normalizedEnabled = uniqueModules(["home" as AppModuleId, ...enabled, "profile" as AppModuleId]);
  const requestedTabs = settings.primaryModuleTabs?.length ? settings.primaryModuleTabs : fallback.tabs;
  const middleTabs = uniqueModulesInOrder(requestedTabs)
    .filter((moduleId) => moduleId !== "home" && moduleId !== "profile")
    .filter((moduleId) => normalizedEnabled.includes(moduleId) && modulesConfig[moduleId].canBeMainTab)
    .slice(0, MAX_PRIMARY_TABS - 2);
  const resolvedPrimaryTabs = ["home" as AppModuleId, ...middleTabs, "profile" as AppModuleId];

  return {
    enabledModules: normalizedEnabled,
    primaryModuleTabs: resolvedPrimaryTabs
  };
}

export function isModuleEnabled(settings: AppSettings, moduleId: AppModuleId) {
  return resolveModulePreferences(settings).enabledModules.includes(moduleId);
}

export function deriveNavigationFocusFromModules(enabledModules: AppModuleId[]): NavigationFocus {
  const hasSport = enabledModules.includes("training") || enabledModules.includes("sessions");
  const hasNutrition = enabledModules.includes("nutrition");

  if (hasSport && hasNutrition) return "both";
  if (hasNutrition) return "nutrition";
  return "sport";
}
