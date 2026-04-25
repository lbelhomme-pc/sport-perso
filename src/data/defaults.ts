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
  vacationWeeks: []
};

export const BADMINTON_VARIANTS = [
  {
    id: "twoBadWedThu",
    label: "2 badmintons : mercredi + jeudi",
    shortLabel: "2 bad",
    description: "Mardi et vendredi restent disponibles pour la salle."
  },
  {
    id: "threeBadTueWedThu",
    label: "3 badmintons : mardi + mercredi + jeudi",
    shortLabel: "3 bad mar-jeu",
    description: "Vendredi devient la séance force, week-end orienté moteur/HYROX."
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
