import type { Settings } from "../types";

export const APP_NAME = "Sport Progress Tracker";

export const APP_TAGLINE = "Suivi sport, nutrition et progression";

export const EVENT_LABEL = "Mode compétition : HYROX Paris Porte de Versailles";

export const DEFAULT_SETTINGS: Settings = {
  startDate: "2026-04-27",
  targetDate: "2026-12-12",
  appMode: "competition",
  enabledSports: ["badminton", "strength", "run", "hyrox", "recovery"],
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
  racket: "Sport de raquette",
  strength: "Musculation / force",
  run: "Course",
  bike: "Vélo",
  swim: "Natation",
  hybrid: "Sport hybride",
  hyrox: "HYROX",
  mobility: "Mobilité",
  recovery: "Récupération",
  test: "Test physique",
  free: "Séance libre",
  other: "Autre"
} as const;

export const PLANNED_TYPE_LABELS = {
  rest: "Repos",
  badminton: "Badminton",
  racket: "Sport de raquette",
  strength: "Musculation / force",
  run: "Course",
  bike: "Vélo",
  swim: "Natation",
  hybrid: "Sport hybride",
  hyrox: "HYROX",
  mobility: "Mobilité",
  recovery: "Récupération",
  test: "Test physique",
  free: "Séance libre"
} as const;

export const GENERAL_SPORT_MODES = [
  {
    id: "fitness",
    label: "Remise en forme",
    description: "Reprendre progressivement, bouger plus et construire une routine durable."
  },
  {
    id: "weight-loss",
    label: "Perte de poids",
    description: "Piloter activité, alimentation et récupération sans pression excessive."
  },
  {
    id: "muscle-gain",
    label: "Prise de muscle",
    description: "Suivre charges, volume, protéines et récupération."
  },
  {
    id: "performance",
    label: "Performance",
    description: "Progresser sur une discipline, un chrono, une charge ou un test."
  },
  {
    id: "hybrid",
    label: "Sport hybride",
    description: "Combiner force, cardio, endurance, puissance et stations."
  },
  {
    id: "racket",
    label: "Sport de raquette",
    description: "Badminton, tennis, padel : appuis, explosivité, cardio intermittent."
  },
  {
    id: "competition",
    label: "Préparation compétition",
    description: "Préparer une date cible avec phases, charge et deload."
  },
  {
    id: "health",
    label: "Santé & régularité",
    description: "Suivre sommeil, hydratation, marche, énergie et séances courtes."
  }
] as const;

export const MEAL_TYPE_LABELS = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  snack: "Collation",
  dinner: "Dîner",
  other: "Autre"
} as const;
