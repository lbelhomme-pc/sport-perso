import type { Settings } from "../types";

export const APP_NAME = "HYROX Prep Tracker";

export const EVENT_LABEL = "HYROX Paris Porte de Versailles";

export const DEFAULT_SETTINGS: Settings = {
  startDate: "2026-04-27",
  targetDate: "2026-12-12",
  startWeight: 80,
  targetWeightLoss: 6,
  proteinPerKg: 1.9,
  heightCm: 178,
  age: 30,
  sex: "male",
  useCalculatedBmr: true,
  dailyCalorieTarget: 1800,
  targetDailyDeficit: 400,
  defaultBodyWeight: 80,
  badmintonVariant: "twoBadWedThu",
  vacationWeeks: []
};

export const BADMINTON_VARIANTS = [
  {
    id: "twoBadTueWed",
    label: "2 badmintons : mardi + mercredi",
    shortLabel: "2 bad mar-mer",
    description: "Jeudi force, vendredi moteur, samedi récupération."
  },
  {
    id: "twoBadTueThu",
    label: "2 badmintons : mardi + jeudi",
    shortLabel: "2 bad mar-jeu",
    description: "Mercredi force, vendredi moteur, samedi récupération."
  },
  {
    id: "twoBadTueFri",
    label: "2 badmintons : mardi + vendredi",
    shortLabel: "2 bad mar-ven",
    description: "Mercredi force, jeudi moteur, samedi récupération."
  },
  {
    id: "twoBadWedThu",
    label: "2 badmintons : mercredi + jeudi",
    shortLabel: "2 bad mer-jeu",
    description: "Configuration de référence : mardi force, vendredi moteur, samedi récupération."
  },
  {
    id: "twoBadWedFri",
    label: "2 badmintons : mercredi + vendredi",
    shortLabel: "2 bad mer-ven",
    description: "Mardi force, jeudi moteur, samedi récupération."
  },
  {
    id: "twoBadThuFri",
    label: "2 badmintons : jeudi + vendredi",
    shortLabel: "2 bad jeu-ven",
    description: "Mardi force, mercredi moteur, samedi récupération."
  },
  {
    id: "threeBadTueWedThu",
    label: "3 badmintons : mardi + mercredi + jeudi",
    shortLabel: "3 bad mar-jeu",
    description: "Vendredi devient la séance force, week-end orienté moteur/HYROX."
  },
  {
    id: "threeBadTueWedFri",
    label: "3 badmintons : mardi + mercredi + vendredi",
    shortLabel: "3 bad mar-mer-ven",
    description: "Jeudi force, samedi moteur, dimanche HYROX spécifique."
  },
  {
    id: "threeBadTueThuFri",
    label: "3 badmintons : mardi + jeudi + vendredi",
    shortLabel: "3 bad mar-jeu-ven",
    description: "Mercredi force, samedi moteur, dimanche HYROX spécifique."
  },
  {
    id: "threeBadWedThuFri",
    label: "3 badmintons : mercredi + jeudi + vendredi",
    shortLabel: "3 bad mer-ven",
    description: "Mardi force, samedi moteur, dimanche HYROX spécifique."
  }
] as const;

export const ENERGY_LEVELS = [
  {
    id: "fatigue",
    label: "Fatigué",
    description: "Version courte, technique, RPE plafonné."
  },
  {
    id: "normal",
    label: "Normal",
    description: "Plan prévu, charge contrôlée."
  },
  {
    id: "strong",
    label: "En forme",
    description: "Option renforcée, seulement si récupération OK."
  }
] as const;

export const SESSION_TYPE_LABELS = {
  badminton: "Badminton",
  strength: "Salle force",
  run: "Course",
  hyrox: "HYROX",
  recovery: "Récupération",
  other: "Autre"
} as const;

export const PLANNED_TYPE_LABELS = {
  rest: "Repos",
  badminton: "Badminton",
  strength: "Salle force",
  run: "Course",
  hyrox: "HYROX",
  recovery: "Récupération"
} as const;

export const MEAL_TYPE_LABELS = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  snack: "Collation",
  dinner: "Dîner",
  other: "Autre"
} as const;
