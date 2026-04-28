import type { ExercisePrescription } from "../types";

function normalizeText(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getExerciseCheckId(exercise: ExercisePrescription) {
  return `exercise:${exercise.id}`;
}

export function formatExercisePrescription(exercise: ExercisePrescription) {
  if (exercise.sets && exercise.distanceM) return `${exercise.sets} x ${exercise.distanceM} m`;
  if (exercise.sets && exercise.repsText) return `${exercise.sets} x ${exercise.repsText}`;
  if (exercise.sets && exercise.reps) return `${exercise.sets} x ${exercise.reps}`;
  if (exercise.repsText) return exercise.repsText;
  if (exercise.distanceM) return `${exercise.distanceM} m`;
  if (exercise.durationSec) return `${exercise.durationSec} s`;
  return "Prescription à ajuster";
}

function hasGenericDuration(text: string) {
  return /^\d+(?:-\d+)?\s*min\.?$/i.test(text.trim());
}

function extractMainStation(text: string) {
  const afterRun = text.match(/(?:^|\s)\d+\s*km\s+course\s*\+\s*([^:,.]+)/i)?.[1];
  if (afterRun) return afterRun.trim();

  const afterPlus = text.match(/\+\s*([^:,.]+)/)?.[1];
  if (afterPlus) return afterPlus.trim();

  return undefined;
}

export function getExerciseDisplayTitle(exercise: ExercisePrescription) {
  const name = exercise.name;
  const normalizedName = normalizeText(name);
  const repsText = exercise.repsText ?? "";
  const normalizedReps = normalizeText(repsText);

  if (/^bloc \d+$/.test(normalizedName)) {
    const station = extractMainStation(repsText);
    return station ? `Course + ${station}` : name;
  }

  if (normalizedName === "bloc principal") {
    if (normalizedReps.includes("rameur")) return "Course + rameur";
    if (normalizedReps.includes("zone 2")) return "Footing zone 2";
    if (/\d+\s*[x×]\s*[\d,.]+\s*(km|m)/i.test(repsText)) return "Course fractionnée";
    if (normalizedReps.includes("footing")) return "Footing facile";
    return "Bloc course";
  }

  if (normalizedName === "substitut skierg") return "Poulie bras tendus + rameur";
  if (normalizedName === "option 1" && normalizedReps.includes("marche")) return "Marche ou vélo zone 2";
  if (normalizedName === "option 2" && normalizedReps.includes("mobilite")) return "Mobilité hanches / chevilles";
  if (["lundi", "vendredi"].includes(normalizedName) && normalizedReps.includes("repos")) return `${name} : repos`;
  if (normalizedName === "samedi" && normalizedReps.includes("course hyrox")) return "Course HYROX";
  if (normalizedName === "mardi ou mercredi") return "Footing très facile";
  if (normalizedName === "jeudi") return "Mobilité + rappel léger";
  if (normalizedName === "echauffement") return "Échauffement guidé";
  if (normalizedName === "retour au calme") return "Retour au calme guidé";

  return name;
}

export function getExerciseInstruction(exercise: ExercisePrescription) {
  const repsText = exercise.repsText ?? "";
  const normalizedName = normalizeText(exercise.name);
  const normalizedReps = normalizeText(repsText);

  if (normalizedName === "echauffement" && hasGenericDuration(repsText)) {
    return `${repsText.replace(/\.$/, "")} : 5 min cardio facile + mobilité hanches/chevilles/épaules + 2-3 montées progressives.`;
  }

  if (normalizedName === "retour au calme" && hasGenericDuration(repsText)) {
    return `${repsText.replace(/\.$/, "")} : marche ou vélo très facile + respiration + mobilité mollets/hanches.`;
  }

  if (normalizedReps.includes("course test deja faite") && normalizedReps.includes("seulement footing facile ou rameur")) {
    return "Footing facile ou rameur 25-35 min en aisance respiratoire. Le test 1 km déjà fait sert seulement de repère, ne le refais pas.";
  }

  if (normalizedReps === "course hyrox.") {
    return "Course HYROX : suivre la course, puis saisir temps, FC moyenne/max, calories, RPE et douleurs éventuelles.";
  }

  if (normalizedReps === "repos.") {
    return "Repos complet. Mobilité douce seulement si ça aide à récupérer.";
  }

  return formatExercisePrescription(exercise);
}

function isMetadataExercise(exercise: ExercisePrescription) {
  const name = normalizeText(exercise.name);
  const repsText = normalizeText(exercise.repsText);

  return [
    /^nombre de blocs\b/,
    /^intensite\b/,
    /^duree\b/,
    /^repos\b/,
    /^blocs?\s*:?$/,
    /^blocs\s*:/,
    /^dans la pwa\b/,
    /^si match\b/,
    /^si fatigue\b/,
    /^pas de fractionne\b/,
    /^plan recommande\b/,
    /^si tu fais badminton\b/
  ].some((pattern) => pattern.test(name) || pattern.test(repsText));
}

function isPreparationExercise(exercise: ExercisePrescription) {
  const text = normalizeText(`${exercise.block} ${exercise.name}`);
  return text.includes("echauffement") || text.includes("activation") || text.includes("retour au calme");
}

export function isGuidanceExercise(exercise: ExercisePrescription) {
  return isMetadataExercise(exercise) || isPreparationExercise(exercise);
}

export function getActionableExercises(exercises: ExercisePrescription[] | undefined) {
  return [...(exercises ?? [])].filter((exercise) => !isGuidanceExercise(exercise)).sort((a, b) => a.order - b.order);
}

export function getGuidanceExercises(exercises: ExercisePrescription[] | undefined) {
  return [...(exercises ?? [])].filter(isGuidanceExercise).sort((a, b) => a.order - b.order);
}

export function getExerciseDetailChips(exercise: ExercisePrescription) {
  const chips: Array<{ label: string; value: string }> = [];
  if (exercise.targetLoadText) chips.push({ label: "Charge", value: exercise.targetLoadText });
  if (exercise.restText) chips.push({ label: "Repos", value: exercise.restText });
  if (exercise.rpeTarget) chips.push({ label: "RPE", value: exercise.rpeTarget });
  return chips;
}
