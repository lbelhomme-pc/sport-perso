import { addDays } from "date-fns";
import type {
  BadmintonVariant,
  DayTemplate,
  EnergyLevel,
  ExercisePrescription,
  PlannedSession,
  PlannedSessionType,
  Settings
} from "../types";
import { getPhaseForWeek } from "./phases";
import { getPreciseWeekPlan, type PreciseSessionPlan } from "./preciseTrainingPlan";
import { getTotalWeeks, getWeekStart, toISODate } from "../utils/dates";

const stationOrder = [
  "1 km course + SkiErg",
  "1 km course + Sled Push",
  "1 km course + Sled Pull",
  "1 km course + Burpee Broad Jumps",
  "1 km course + rameur",
  "1 km course + Farmer Carry",
  "1 km course + Sandbag Lunges",
  "1 km course + Wall Balls"
];

function exercise(input: Omit<ExercisePrescription, "order"> & { order?: number }): ExercisePrescription {
  return {
    ...input,
    order: input.order ?? 0
  };
}

function getStrengthExercises(week: number): ExercisePrescription[] {
  const deload = isDeloadWeek(week);
  const sledPushSets = deload ? 4 : week <= 4 ? 4 + week : week <= 8 ? 6 : week <= 12 ? 7 : 8;
  const sledPullSets = deload ? 3 : week <= 4 ? 3 + week : week <= 8 ? 5 : week <= 12 ? 6 : 7;
  const wallBallReps = week <= 4 ? "10-12" : week <= 8 ? "15" : week <= 20 ? "15-20" : "20-25";

  return [
    exercise({
      id: "strength-warmup-cardio",
      block: "Échauffement",
      name: "Rameur / vélo / marche inclinée",
      order: 1,
      repsText: "6-8 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 3-4",
      fatigueAdjustment: "10 min zone 2 facile si les jambes sont lourdes."
    }),
    exercise({
      id: "strength-warmup-mobility",
      block: "Échauffement",
      name: "Mobilité hanches / chevilles + activation",
      order: 2,
      repsText: "5 min",
      targetLoadText: "poids du corps",
      restText: "-",
      rpeTarget: "RPE 3",
      techniqueNotes: ["Squats poids du corps", "Fentes arrière", "Farmer carry léger", "Sled à vide si disponible"]
    }),
    exercise({
      id: "strength-sled-push",
      block: "A1",
      name: "Sled Push",
      order: 3,
      sets: sledPushSets,
      distanceM: 12.5,
      targetLoadText: deload ? "60-70 % calibration" : "80-90 % calibration RPE 7",
      loadMode: "percentCalibration",
      percentCalibration: deload ? 65 : 85,
      restSec: deload ? 90 : 120,
      restText: deload ? "90 s" : "2 min",
      rpeTarget: deload ? "RPE 5-6" : "RPE 7-8",
      techniqueNotes: ["Buste gainé", "Poussée propre", "Stop si douleur genou/mollet"],
      fatigueAdjustment: "4 x 12,5 m à 60-70 % calibration, repos 90 s.",
      strongAdjustment: "8 x 12,5 m à 90-105 % calibration, repos 2 min 30."
    }),
    exercise({
      id: "strength-sled-pull",
      block: "A2",
      name: "Sled Pull",
      order: 4,
      sets: sledPullSets,
      distanceM: 12.5,
      targetLoadText: deload ? "60-70 % calibration" : "80-90 % calibration RPE 7",
      loadMode: "percentCalibration",
      percentCalibration: deload ? 65 : 85,
      restSec: deload ? 90 : 120,
      restText: deload ? "90 s" : "2 min",
      rpeTarget: deload ? "RPE 5-6" : "RPE 7-8",
      techniqueNotes: ["Dos neutre", "Bras + dos + jambes", "Corde ramenée régulièrement"],
      fatigueAdjustment: "3 x 12,5 m à 60-70 % calibration, repos 90 s.",
      strongAdjustment: "6 x 12,5 m à 90-105 % calibration, repos 2 min 30."
    }),
    exercise({
      id: "strength-main-lift",
      block: "B",
      name: "Trap bar deadlift ou front squat",
      order: 5,
      sets: deload ? 3 : 4,
      reps: deload ? 8 : 5,
      targetLoadText: deload ? "léger/modéré" : "charge 5 reps propre, RPE 7",
      loadMode: "rpe",
      restSec: deload ? 120 : 180,
      restText: deload ? "2 min" : "2 min 30 à 3 min",
      rpeTarget: deload ? "RPE 6" : "RPE 7",
      techniqueNotes: ["2 reps en réserve", "Aucune série à l'échec", "Réduire si le dos se dégrade"],
      fatigueAdjustment: "Remplacer par goblet squat 3 x 8 léger/modéré.",
      strongAdjustment: "5 x 4 à RPE 7-8, repos 3 min."
    }),
    exercise({
      id: "strength-bulgarian-split-squat",
      block: "C",
      name: "Bulgarian split squat",
      order: 6,
      sets: 3,
      repsText: deload ? "8/jambe" : "8-10/jambe",
      targetLoadText: "RPE 7, haltères si propre",
      loadMode: "rpe",
      restSec: 90,
      restText: "30-45 s entre jambes, 90 s entre séries",
      rpeTarget: deload ? "RPE 6" : "RPE 7",
      techniqueNotes: ["Genou stable", "Amplitude contrôlée", "Pas de douleur articulaire"]
    }),
    exercise({
      id: "strength-rdl",
      block: "D",
      name: "Soulevé de terre roumain haltères",
      order: 7,
      sets: 3,
      repsText: "8-10",
      targetLoadText: "RPE 7",
      loadMode: "rpe",
      restSec: 120,
      restText: "90 à 120 s",
      rpeTarget: "RPE 7",
      techniqueNotes: ["Charnière de hanche", "Dos neutre", "Ischios sous tension"]
    }),
    exercise({
      id: "strength-farmer-carry",
      block: "E",
      name: "Farmer Carry",
      order: 8,
      sets: deload ? 3 : 3,
      distanceM: deload ? 60 : 80,
      targetLoadText: "RPE 7, objectif course 2 x 24 kg",
      loadMode: "raceLoad",
      restSec: 120,
      restText: "2 à 3 min",
      rpeTarget: deload ? "RPE 6" : "RPE 7",
      techniqueNotes: ["Marcher grand", "Grip solide", "Épaules basses"],
      strongAdjustment: "4 x 100 m lourd propre."
    }),
    exercise({
      id: "strength-wall-balls",
      block: "F",
      name: "Wall Balls",
      order: 9,
      sets: deload ? 4 : 5,
      repsText: wallBallReps,
      targetLoadText: "6 kg si Open Homme, cible 3 m si disponible",
      loadMode: "raceLoad",
      restSec: deload ? 60 : 75,
      restText: deload ? "45-60 s" : "60-75 s",
      rpeTarget: deload ? "RPE 6" : "RPE 7-8",
      techniqueNotes: ["Squat propre", "Respiration régulière", "No rep = on ralentit"],
      fatigueAdjustment: "4 x 8-10 léger/cible, repos 45-60 s.",
      strongAdjustment: "6 x 15-20, charge cible, repos 60-75 s."
    }),
    exercise({
      id: "strength-side-plank",
      block: "G",
      name: "Gainage latéral",
      order: 10,
      sets: 3,
      repsText: "30-45 s/côté",
      targetLoadText: "poids du corps",
      loadMode: "bodyweight",
      restSec: 45,
      restText: "30-45 s",
      rpeTarget: "propre"
    })
  ];
}

function getRunExercises(week: number): ExercisePrescription[] {
  const deload = isDeloadWeek(week);
  const runVolume = deload
    ? "35-45 min zone 2 + 4 accélérations"
    : week <= 8
      ? "5 x 800 m course + 500 m rameur"
      : week <= 16
        ? "5-6 x 1 km course + 500 m SkiErg/rames"
        : week <= 24
          ? "6-7 x 1 km allure HYROX + station courte"
          : "7-8 x 1 km progressifs";

  return [
    exercise({
      id: "run-warmup",
      block: "Échauffement",
      name: "Footing / tapis",
      order: 1,
      repsText: "8-10 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 3-4"
    }),
    exercise({
      id: "run-accelerations",
      block: "Activation",
      name: "Accélérations progressives",
      order: 2,
      sets: 3,
      durationSec: 20,
      targetLoadText: "contrôlé",
      restSec: 40,
      restText: "40 s",
      rpeTarget: "RPE 6"
    }),
    exercise({
      id: "run-main-block",
      block: "A",
      name: "Course + rameur/SkiErg",
      order: 3,
      repsText: runVolume,
      targetLoadText: deload ? "facile" : "allure HYROX contrôlée",
      restSec: deload ? 90 : 90,
      restText: deload ? "libre / facile" : "75 à 90 s après chaque tour",
      rpeTarget: deload ? "RPE 5-6" : "RPE 7",
      fatigueAdjustment: "30-40 min zone 2 + 3 x 500 m facile.",
      strongAdjustment: "6-8 tours : 1 km course + 250 m SkiErg ou 10 burpees, repos 75 s."
    }),
    exercise({
      id: "run-burpee-broad-jumps",
      block: "B",
      name: "Burpee Broad Jumps",
      order: 4,
      sets: deload ? 3 : 5,
      distanceM: 10,
      targetLoadText: "régulier, pas sprinté",
      loadMode: "bodyweight",
      restSec: deload ? 75 : 75,
      restText: "60-75 s",
      rpeTarget: deload ? "RPE 6" : "RPE 7",
      techniqueNotes: ["Allure régulière", "Réception propre", "Stop avant le chaos"]
    }),
    exercise({
      id: "run-farmer-carry",
      block: "C",
      name: "Farmer Carry optionnel",
      order: 5,
      sets: deload ? 2 : 3,
      distanceM: deload ? 40 : 80,
      targetLoadText: "modéré",
      restSec: 90,
      restText: "90 s",
      rpeTarget: "RPE 6-7",
      strongAdjustment: "4 x 100 m lourd propre, repos 2 min."
    }),
    exercise({
      id: "run-cooldown",
      block: "D",
      name: "Retour au calme",
      order: 6,
      repsText: "8-10 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 2-3"
    })
  ];
}

function getHyroxRestText(week: number): string {
  if (week <= 8) return "90-120 s entre blocs";
  if (week <= 24) return "60-90 s entre blocs";
  if (week <= 31) return "45-75 s ou transition rapide";
  return "repos libre, fraîcheur prioritaire";
}

function getHyroxStationExercise(station: string, order: number, week: number, intensity: string): ExercisePrescription {
  const common = {
    id: `hyrox-block-${order}`,
    block: `Bloc ${order}`,
    name: station,
    order,
    restText: getHyroxRestText(week),
    rpeTarget: isDeloadWeek(week) ? "RPE 6" : "RPE 7-8",
    targetLoadText: intensity
  };

  if (station.includes("Sled Push")) {
    return exercise({
      ...common,
      repsText: "1 km course + 4 x 12,5 m",
      targetLoadText: "70-100 % calibration selon phase",
      loadMode: "percentCalibration",
      techniqueNotes: ["Transitions propres", "Poussée continue", "Ne pas exploser sur le premier aller"]
    });
  }

  if (station.includes("Sled Pull")) {
    return exercise({
      ...common,
      repsText: "1 km course + 4 x 12,5 m",
      targetLoadText: "70-100 % calibration selon phase",
      loadMode: "percentCalibration",
      techniqueNotes: ["Dos neutre", "Corde fluide", "Relancer avec les jambes"]
    });
  }

  if (station.includes("SkiErg")) {
    return exercise({ ...common, repsText: "1 km course + 1000 m SkiErg", targetLoadText: "pace RPE 7" });
  }

  if (station.includes("rameur")) {
    return exercise({ ...common, repsText: "1 km course + 1000 m rameur", targetLoadText: "pace RPE 7" });
  }

  if (station.includes("Burpee")) {
    return exercise({ ...common, repsText: "1 km course + 40 à 80 m", loadMode: "bodyweight", targetLoadText: "régulier" });
  }

  if (station.includes("Farmer")) {
    return exercise({ ...common, repsText: "1 km course + 100 à 200 m", targetLoadText: "objectif course 2 x 24 kg", loadMode: "raceLoad" });
  }

  if (station.includes("Sandbag")) {
    return exercise({ ...common, repsText: "1 km course + 40 à 100 m", targetLoadText: "10 à 20 kg selon genoux", loadMode: "raceLoad" });
  }

  return exercise({ ...common, repsText: "1 km course + 50 à 100 reps", targetLoadText: "6 kg si Open Homme", loadMode: "raceLoad" });
}

function getHyroxExercises(week: number): ExercisePrescription[] {
  const simulation = getSimulationDose(week);

  return [
    exercise({
      id: "hyrox-warmup",
      block: "Échauffement",
      name: "Footing ou rameur + mobilité",
      order: 0,
      repsText: "10-12 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 3-4",
      techniqueNotes: ["Chevilles/hanches/épaules", "2 x 8 wall balls légers", "2 x 30 m farmer léger"]
    }),
    ...simulation.stations.map((station, index) => getHyroxStationExercise(station, index + 1, week, simulation.intensity)),
    exercise({
      id: "hyrox-cooldown",
      block: "Fin",
      name: "Retour au calme",
      order: 99,
      repsText: "8-10 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 2-3"
    })
  ];
}

function getBadmintonExercises(): ExercisePrescription[] {
  return [
    exercise({
      id: "badminton-warmup",
      block: "Échauffement",
      name: "Activation jambes + appuis",
      order: 1,
      repsText: "8-10 min",
      targetLoadText: "progressif",
      restText: "-",
      rpeTarget: "RPE 3-5",
      techniqueNotes: ["Squats", "Fentes", "Mollets", "Pas chassés", "Accélérations progressives"]
    }),
    exercise({
      id: "badminton-session",
      block: "Jeu",
      name: "Badminton",
      order: 2,
      repsText: "60-90 min",
      targetLoadText: "technique / match selon fatigue",
      restText: "hydratation entre matchs",
      rpeTarget: "RPE 6-8",
      fatigueAdjustment: "Jeu technique, peu de matchs intenses, stop si douleur.",
      strongAdjustment: "Séance normale à intense, sans dépasser 90 min de haute intensité."
    }),
    exercise({
      id: "badminton-cooldown",
      block: "Retour au calme",
      name: "Marche + mobilité mollets/adducteurs",
      order: 3,
      repsText: "5-8 min",
      targetLoadText: "facile",
      restText: "-",
      rpeTarget: "RPE 2"
    })
  ];
}

export const weekTemplates: Record<BadmintonVariant, DayTemplate[]> = {
  twoBadWedThu: [
    { day: "Lundi", slot: "rest" },
    { day: "Mardi", slot: "strength", note: "Salle possible si pas de badminton mardi soir." },
    { day: "Mercredi", slot: "badminton" },
    { day: "Jeudi", slot: "badminton" },
    { day: "Vendredi", slot: "run", note: "Salle possible si pas de badminton vendredi soir." },
    { day: "Samedi", slot: "recovery" },
    { day: "Dimanche", slot: "hyrox" }
  ],
  threeBadTueWedThu: [
    { day: "Lundi", slot: "rest" },
    { day: "Mardi", slot: "badminton" },
    { day: "Mercredi", slot: "badminton" },
    { day: "Jeudi", slot: "badminton" },
    { day: "Vendredi", slot: "strength", note: "Séance force plus compacte après trois soirs de badminton." },
    { day: "Samedi", slot: "run" },
    { day: "Dimanche", slot: "hyrox" }
  ],
  threeBadWedThuFri: [
    { day: "Lundi", slot: "rest" },
    { day: "Mardi", slot: "strength", note: "Salle possible car pas de badminton mardi soir." },
    { day: "Mercredi", slot: "badminton" },
    { day: "Jeudi", slot: "badminton" },
    { day: "Vendredi", slot: "badminton" },
    { day: "Samedi", slot: "run" },
    { day: "Dimanche", slot: "hyrox" }
  ]
};

export function isDeloadWeek(week: number): boolean {
  return week % 4 === 0;
}

export function isVacationWeek(settings: Settings, week: number): boolean {
  return settings.vacationWeeks.includes(week);
}

function getStrengthProgression(week: number) {
  const deload = isDeloadWeek(week);

  if (week <= 4) {
    return {
      sledPush: deload ? "4 x 12,5 m léger" : `${4 + week} x 12,5 m`,
      sledPull: deload ? "3 x 12,5 m léger" : `${3 + week} x 12,5 m`,
      mainLift: deload ? "presse légère 3 x 8" : "trap bar deadlift ou front squat 4 x 5",
      wallBalls: deload ? "4 x 8" : "5 x 10 à 12",
      rpe: deload ? "RPE 5-6" : "RPE 7"
    };
  }

  if (week <= 8) {
    return {
      sledPush: deload ? "5 x 12,5 m léger" : "6 x 12,5 m",
      sledPull: deload ? "4 x 12,5 m léger" : "5 x 12,5 m",
      mainLift: deload ? "goblet squat 3 x 10" : "front squat ou presse 4 x 6",
      wallBalls: deload ? "4 x 10" : "5 x 15",
      rpe: deload ? "RPE 5-6" : "RPE 7"
    };
  }

  if (week <= 12) {
    return {
      sledPush: deload ? "5 x 12,5 m modéré" : "7 x 12,5 m lourd",
      sledPull: deload ? "4 x 12,5 m modéré" : "6 x 12,5 m lourd",
      mainLift: deload ? "soulevé de terre roumain 3 x 8" : "trap bar deadlift 5 x 4",
      wallBalls: deload ? "4 x 12" : "6 x 15",
      rpe: deload ? "RPE 6" : "RPE 7-8"
    };
  }

  if (week <= 20) {
    return {
      sledPush: deload ? "5 x 12,5 m technique" : "8 x 12,5 m",
      sledPull: deload ? "5 x 12,5 m technique" : "7 x 12,5 m",
      mainLift: deload ? "presse 3 x 8" : "front squat 4 x 5 + fentes 3 x 10",
      wallBalls: deload ? "4 x 12" : "6 x 18 à 20",
      rpe: deload ? "RPE 6" : "RPE 8"
    };
  }

  if (week <= 28) {
    return {
      sledPush: deload ? "5 x 12,5 m propre" : "8 x 12,5 m charge course ou proche",
      sledPull: deload ? "5 x 12,5 m propre" : "7 x 12,5 m charge course ou proche",
      mainLift: deload ? "goblet squat 3 x 8" : "force entretien : 3 x 5 lourd mais propre",
      wallBalls: deload ? "4 x 15" : "5 x 25",
      rpe: deload ? "RPE 6" : "RPE 8"
    };
  }

  if (week <= 31) {
    return {
      sledPush: week === 30 ? "6 x 12,5 m charge course" : "5 x 12,5 m dynamique",
      sledPull: week === 30 ? "5 x 12,5 m charge course" : "4 x 12,5 m dynamique",
      mainLift: "force entretien : 3 x 3 à 5, sans échec",
      wallBalls: "4 x 20 propres",
      rpe: "RPE 7"
    };
  }

  return {
    sledPush: "3 x 12,5 m facile",
    sledPull: "3 x 12,5 m facile",
    mainLift: "activation légère 2 x 8",
    wallBalls: "3 x 10 faciles",
    rpe: "RPE 5"
  };
}

function getRunSession(week: number): string {
  if (week === 1) {
    return "Tests : 1 km course chrono + 1000 m rameur chrono + 20 min zone 2.";
  }

  if (week === 2) {
    return "5 x 600 m à RPE 7, récupération 90 s + 500 m rameur facile entre les blocs.";
  }

  if (week === 3) {
    return "5 x 800 m à RPE 7 + 500 m SkiErg ou rameur entre les blocs.";
  }

  if (isDeloadWeek(week)) {
    return "Deload : 35 à 45 min zone 2 + 4 accélérations de 20 s, sans forcer.";
  }

  if (week <= 8) {
    return "5 x 800 m course + 500 m rameur, récupération 90 s.";
  }

  if (week <= 12) {
    return "5 x 1 km course allure HYROX + 500 m SkiErg, récupération 75 à 90 s.";
  }

  if (week <= 16) {
    return "6 x 1 km course + 10 burpees broad jumps ou 15 wall balls, récupération 75 s.";
  }

  if (week <= 20) {
    return "6 x 1 km allure HYROX + station courte, récupération 60 à 75 s.";
  }

  if (week <= 24) {
    return "7 x 1 km allure HYROX + station courte, transitions rapides.";
  }

  if (week <= 28) {
    return "8 x 1 km progressifs, dernier tiers proche allure course.";
  }

  if (week <= 31) {
    return week === 30
      ? "Rappel vitesse : 5 x 1 km allure course, récupération 90 s. Pas plus."
      : "4 à 5 x 1 km contrôlés + mobilité longue.";
  }

  if (week === 32) {
    return "Affûtage : 3 x 1 km allure course, récupération complète.";
  }

  return "Semaine course : 20 à 30 min facile + 3 accélérations de 20 s.";
}

function getSimulationDose(week: number) {
  const blocks = Math.min(8, Math.max(3, Math.ceil(week / 4) + 3));
  let intensity = "70 %";

  if (week >= 9) intensity = "75 %";
  if (week >= 17) intensity = "80 %";
  if (week >= 25) intensity = "80-85 %";
  if (week >= 29) intensity = week === 30 ? "85-90 %" : "75-80 %";
  if (week >= 32) intensity = "50-60 %";
  if (isDeloadWeek(week)) intensity = "60-70 %";

  return {
    blocks: isDeloadWeek(week) ? Math.max(3, blocks - 2) : blocks,
    intensity,
    stations: stationOrder.slice(0, blocks)
  };
}

function getVacationSession(slot: DayTemplate["slot"], week: number, date: string, day: string): PlannedSession {
  const base = {
    id: `week-${week}-${date}-${slot}`,
    week,
    day,
    date,
    durationMin: 35,
    rpeTarget: "RPE 4-6",
    tags: ["Vacances", "Maintenance"]
  };

  if (slot === "badminton") {
    return {
      ...base,
      type: "badminton",
      title: "Badminton loisir contrôlé",
      objective: "Garder le plaisir et le rythme sans transformer la semaine en dette de fatigue.",
      fatigueVersion: "45 min technique, mobilité avant/après, aucun match à haute intensité.",
      normalVersion: "60 à 75 min, priorité au jeu propre et à la qualité des appuis.",
      strongVersion: "Séance normale possible, mais stop avant la fatigue nerveuse.",
      durationMin: 60,
      tags: ["Badminton", "Vacances", "Technique"]
    };
  }

  if (slot === "rest") {
    return buildRestSession(week, date, day, true);
  }

  if (slot === "recovery") {
    return buildRecoverySession(week, date, day, true);
  }

  return {
    ...base,
    type: slot === "hyrox" ? "hyrox" : slot === "run" ? "run" : "strength",
    title: slot === "run" ? "Footing vacances + mobilité" : "Circuit hôtel HYROX léger",
    objective: "Entretenir le moteur avec peu de matériel, sans chercher la performance.",
    fatigueVersion: "20 min marche active + 10 min mobilité hanches/mollets/épaules.",
    normalVersion: "4 tours faciles : 3 min cardio + 12 squats + 10 pompes inclinées + 30 s gainage.",
    strongVersion: "5 à 6 tours propres + 6 accélérations de 15 s, toujours en contrôle.",
    durationMin: slot === "run" ? 40 : 35,
    tags: ["Vacances", slot === "run" ? "Zone 2" : "Circuit"]
  };
}

function getPlannedTypeForSlot(slot: DayTemplate["slot"]): PlannedSessionType {
  if (slot === "rest") return "rest";
  if (slot === "badminton") return "badminton";
  if (slot === "strength") return "strength";
  if (slot === "run") return "run";
  if (slot === "recovery") return "recovery";
  return "hyrox";
}

function buildPreciseSession(
  slot: DayTemplate["slot"],
  plan: PreciseSessionPlan,
  week: number,
  date: string,
  day: string
): PlannedSession {
  const type = getPlannedTypeForSlot(slot);

  return {
    id: `week-${week}-${date}-${slot}`,
    week,
    day,
    date,
    type,
    title: plan.title,
    objective: plan.objective,
    durationMin: plan.durationMin,
    rpeTarget: plan.rpeTarget,
    fatigueVersion: plan.fatigueVersion,
    normalVersion: plan.normalVersion,
    strongVersion: plan.strongVersion,
    tags: plan.tags,
    exercises: plan.exercises,
    isEditable: type !== "rest"
  };
}

function buildRaceSession(week: number, date: string, day: string): PlannedSession {
  return {
    id: `week-${week}-${date}-race`,
    week,
    day,
    date,
    type: "hyrox",
    title: "Course HYROX Paris Porte de Versailles",
    objective: "Arriver frais, exécuter le plan, gérer l’allure et valider toute la préparation.",
    durationMin: 100,
    rpeTarget: "RPE course",
    fatigueVersion: "Jour J : pas de séance bonus. Échauffement progressif, hydratation, glucides simples, pacing prudent au départ.",
    normalVersion:
      "Jour J : sommeil, repas digeste, échauffement progressif puis HYROX complet. Objectif : régularité, transitions propres, aucune folie sur les premiers kilomètres.",
    strongVersion:
      "Même si tu te sens très bien : départ contrôlé. Utilise l’énergie pour finir fort, pas pour exploser le premier tiers.",
    tags: ["Course", "HYROX", "Paris", "Objectif"],
    exercises: [
      exercise({
        id: "race-prep",
        block: "Avant course",
        name: "Routine pré-course",
        order: 1,
        repsText: "repas digeste + hydratation + échauffement progressif",
        targetLoadText: "fraîcheur prioritaire",
        restText: "-",
        rpeTarget: "RPE 2-4"
      }),
      exercise({
        id: "race-warmup",
        block: "Échauffement",
        name: "Footing très facile + accélérations",
        order: 2,
        repsText: "20-25 min facile + 3 x 20 s progressif",
        targetLoadText: "contrôlé",
        restText: "récupération complète",
        rpeTarget: "RPE 3-6"
      }),
      exercise({
        id: "race-hyrox",
        block: "Course",
        name: "HYROX complet",
        order: 3,
        repsText: "8 x 1 km + 8 stations",
        targetLoadText: "allure régulière",
        restText: "transitions propres",
        rpeTarget: "RPE progressif"
      }),
      exercise({
        id: "race-recovery",
        block: "Après course",
        name: "Récupération immédiate",
        order: 4,
        repsText: "marche, eau/électrolytes, protéines + glucides",
        targetLoadText: "calme",
        restText: "-",
        rpeTarget: "RPE 1-2"
      })
    ],
    isEditable: true
  };
}

function buildPostRaceRecoverySession(week: number, date: string, day: string): PlannedSession {
  return {
    id: `week-${week}-${date}-post-race-recovery`,
    week,
    day,
    date,
    type: "recovery",
    title: "Récupération post-course",
    objective: "Faire redescendre la fatigue, marcher doucement et noter les sensations de la course.",
    durationMin: 20,
    rpeTarget: "RPE 1-2",
    fatigueVersion: "Repos complet, marche très douce uniquement si ça aide.",
    normalVersion: "20 min marche facile + mobilité douce. Note les douleurs, la fatigue, le sommeil et la satisfaction de course.",
    strongVersion: "Garde l’envie pour plus tard : aujourd’hui, récupération uniquement.",
    tags: ["Post-course", "Récupération"],
    exercises: [
      exercise({
        id: "post-race-walk",
        block: "Récupération",
        name: "Marche facile",
        order: 1,
        repsText: "10-20 min",
        targetLoadText: "très facile",
        restText: "-",
        rpeTarget: "RPE 1-2"
      }),
      exercise({
        id: "post-race-notes",
        block: "Bilan",
        name: "Notes sensations",
        order: 2,
        repsText: "douleurs, énergie, sommeil, points forts, points à garder",
        targetLoadText: "journal",
        restText: "-",
        rpeTarget: "calme"
      })
    ],
    isEditable: true
  };
}

function buildRestSession(week: number, date: string, day: string, vacation = false): PlannedSession {
  return {
    id: `week-${week}-${date}-rest`,
    week,
    day,
    date,
    type: "rest",
    title: vacation ? "Repos vacances" : "Repos complet",
    objective: "Récupérer vraiment, absorber la charge et protéger le lundi.",
    durationMin: 0,
    rpeTarget: "RPE 0",
    fatigueVersion: "Repos complet, mobilité 8 min si ça fait du bien.",
    normalVersion: "Repos complet, marche douce possible.",
    strongVersion: "Repos quand même. L’énergie sert à mieux encaisser la suite.",
    tags: ["Repos", "Prioritaire"]
  };
}

function buildRecoverySession(week: number, date: string, day: string, vacation = false): PlannedSession {
  return {
    id: `week-${week}-${date}-recovery`,
    week,
    day,
    date,
    type: "recovery",
    title: vacation ? "Récupération vacances" : "Récupération active",
    objective: "Faire circuler sans ajouter de fatigue.",
    durationMin: vacation ? 25 : 40,
    rpeTarget: "RPE 3-4",
    fatigueVersion: "15 à 20 min marche facile + respiration.",
    normalVersion: "30 à 45 min zone 2 très facile : vélo, marche inclinée ou mobilité.",
    strongVersion: "45 min zone 2 facile + mobilité longue, pas d’intensité cachée.",
    tags: ["Zone 2", "Mobilité"]
  };
}

function buildBadmintonSession(week: number, date: string, day: string): PlannedSession {
  return {
    id: `week-${week}-${date}-badminton`,
    week,
    day,
    date,
    type: "badminton",
    title: "Badminton",
    objective: "Travailler les appuis, le cardio intermittent et le plaisir sans saboter la récupération.",
    durationMin: 75,
    rpeTarget: "RPE 6-8",
    fatigueVersion:
      "Échauffement long, jeu technique, peu de matchs à haute intensité. Stop si douleur mollet, tendon ou genou.",
    normalVersion:
      "Séance normale. 8 à 10 min d’échauffement : squats, fentes, mollets, pas chassés, accélérations.",
    strongVersion:
      "Séance normale à intense, sans dépasser 90 min de haute intensité. Hydratation + protéines après.",
    tags: ["Badminton", "Appuis", "Intermittent"],
    exercises: getBadmintonExercises(),
    isEditable: true
  };
}

function buildStrengthSession(week: number, date: string, day: string): PlannedSession {
  const strength = getStrengthProgression(week);

  return {
    id: `week-${week}-${date}-strength`,
    week,
    day,
    date,
    type: "strength",
    title: "Salle 1 - Force + sled",
    objective: "Construire la force spécifique HYROX sans chercher l’échec musculaire.",
    durationMin: 70,
    rpeTarget: strength.rpe,
    fatigueVersion: `45 à 50 min. 10 min zone 2, Sled Push ${strength.sledPush}, Sled Pull ${strength.sledPull}, goblet squat 3 x 8, rowing 3 x 10, wall balls ${strength.wallBalls}. Tout à RPE 5-6.`,
    normalVersion: `70 à 80 min. Sled Push ${strength.sledPush}, Sled Pull ${strength.sledPull}, ${strength.mainLift}, fentes ou split squat 3 x 8/jambe, farmer carry 3 x 80 m, wall balls ${strength.wallBalls}.`,
    strongVersion: `75 à 85 min. Sled Push ${strength.sledPush}, Sled Pull ${strength.sledPull}, ${strength.mainLift}, farmer carry 4 x 80 à 120 m, wall balls ${strength.wallBalls}. Bonus : 4 x 400 m course + 15 wall balls.`,
    tags: ["Salle", "Force", "Sled", strength.rpe],
    exercises: getStrengthExercises(week),
    isEditable: true
  };
}

function buildRunSession(week: number, date: string, day: string): PlannedSession {
  const run = getRunSession(week);

  return {
    id: `week-${week}-${date}-run`,
    week,
    day,
    date,
    type: "run",
    title: "Salle 2 - Course + moteur",
    objective: "Stabiliser l’allure HYROX et apprendre à relancer avec les jambes entamées.",
    durationMin: isDeloadWeek(week) ? 45 : 65,
    rpeTarget: isDeloadWeek(week) ? "RPE 5-6" : "RPE 7",
    fatigueVersion:
      "35 à 45 min zone 2 : vélo, rameur ou marche inclinée. Puis 3 x 500 m course facile + 3 x 10 wall balls légers.",
    normalVersion: `${run} Finir par 5 x 10 m burpee broad jumps propres et 8 min retour au calme.`,
    strongVersion: `${run} Puis farmer carry 4 x 100 m lourd + gainage 3 x 45 s. Tu dois finir fort, pas explosé.`,
    tags: ["Course", "Moteur", isDeloadWeek(week) ? "Deload" : "HYROX pace"],
    exercises: getRunExercises(week),
    isEditable: true
  };
}

function buildHyroxSession(week: number, date: string, day: string): PlannedSession {
  const simulation = getSimulationDose(week);
  const phaseTags = isDeloadWeek(week) ? ["Deload"] : [`${simulation.blocks} blocs`, simulation.intensity];

  return {
    id: `week-${week}-${date}-hyrox`,
    week,
    day,
    date,
    type: "hyrox",
    title: "Salle 3 - Spécifique HYROX",
    objective: "Enchaîner course et stations avec des transitions propres et un pacing répétable.",
    durationMin: isDeloadWeek(week) ? 50 : 80,
    rpeTarget: isDeloadWeek(week) ? "RPE 6" : "RPE 7-8",
    fatigueVersion:
      "4 à 5 tours tranquilles : 400 m course facile ou 2 min vélo + 250 m rameur + 10 wall balls + 20 m farmer carry + 10 fentes sans charge.",
    normalVersion: `${simulation.blocks} blocs à ${simulation.intensity}. Stations prévues : ${simulation.stations.join(" / ")}. Objectif : régularité et transitions propres.`,
    strongVersion: `${simulation.blocks} blocs HYROX à ${simulation.intensity}. Transitions rapides, pacing propre, aucun sprint idiot au début.`,
    tags: ["Spécifique", ...phaseTags],
    exercises: getHyroxExercises(week),
    isEditable: true
  };
}

function buildSession(slot: DayTemplate["slot"], week: number, date: string, day: string): PlannedSession {
  const precisePlan = getPreciseWeekPlan(week)?.sessions[slot];
  if (precisePlan) return buildPreciseSession(slot, precisePlan, week, date, day);

  if (slot === "rest") return buildRestSession(week, date, day);
  if (slot === "recovery") return buildRecoverySession(week, date, day);
  if (slot === "badminton") return buildBadmintonSession(week, date, day);
  if (slot === "strength") return buildStrengthSession(week, date, day);
  if (slot === "run") return buildRunSession(week, date, day);
  return buildHyroxSession(week, date, day);
}

export function getPlannedWeek(
  settings: Settings,
  week: number,
  variant: BadmintonVariant = "twoBadWedThu"
): PlannedSession[] {
  const weekStart = getWeekStart(settings.startDate, week);
  const vacation = isVacationWeek(settings, week);

  return weekTemplates[variant].map((template, index) => {
    const date = toISODate(addDays(weekStart, index));

    if (date === settings.targetDate) {
      return buildRaceSession(week, date, template.day);
    }

    if (date > settings.targetDate) {
      return buildPostRaceRecoverySession(week, date, template.day);
    }

    return vacation
      ? getVacationSession(template.slot, week, date, template.day)
      : buildSession(template.slot, week, date, template.day);
  });
}

export function getDisplayedVersion(session: PlannedSession, energy: EnergyLevel): string {
  if (energy === "fatigue") return session.fatigueVersion;
  if (energy === "strong") return session.strongVersion;
  return session.normalVersion;
}

export function getTrainingContext(settings: Settings, week: number) {
  const totalWeeks = getTotalWeeks(settings.startDate, settings.targetDate);
  const basePhase = getPhaseForWeek(week, totalWeeks);
  const preciseWeek = getPreciseWeekPlan(week);
  const statusText = preciseWeek?.status ?? preciseWeek?.note ?? "";
  const phase = preciseWeek
    ? {
        ...basePhase,
        title: preciseWeek.phaseTitle,
        summary: statusText || basePhase.summary,
        focus: preciseWeek.dateRange
      }
    : basePhase;

  return {
    totalWeeks,
    phase,
    deload: isDeloadWeek(week) || /allégée|affûtage|course/i.test(statusText),
    vacation: isVacationWeek(settings, week)
  };
}

export function getPlannedIntensity(type: PlannedSessionType): number {
  if (type === "rest") return 0;
  if (type === "recovery") return 1;
  if (type === "badminton") return 3;
  if (type === "strength") return 3;
  if (type === "run") return 4;
  return 4;
}
