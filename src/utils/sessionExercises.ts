import type { CompletedExerciseEntry, ExercisePrescription, PlannedSession } from "../types";

function formatPrescription(exercise: ExercisePrescription): string {
  if (exercise.sets && exercise.distanceM) return `${exercise.sets} x ${exercise.distanceM} m`;
  if (exercise.sets && exercise.repsText) return `${exercise.sets} x ${exercise.repsText}`;
  if (exercise.sets && exercise.reps) return `${exercise.sets} x ${exercise.reps}`;
  if (exercise.repsText) return exercise.repsText;
  if (exercise.distanceM) return `${exercise.distanceM} m`;
  if (exercise.durationSec) return `${exercise.durationSec} s`;
  return "Prescription à ajuster";
}

export function formatPlannedExerciseLine(exercise: ExercisePrescription): string {
  return [
    `${exercise.block} - ${exercise.name}`,
    formatPrescription(exercise),
    exercise.targetLoadText ? `Charge : ${exercise.targetLoadText}` : undefined,
    exercise.restText ? `Repos : ${exercise.restText}` : undefined,
    exercise.rpeTarget ? `RPE : ${exercise.rpeTarget}` : undefined
  ]
    .filter(Boolean)
    .join(" | ");
}

export function buildCompletedExercises(planned?: PlannedSession, completed = true): CompletedExerciseEntry[] | undefined {
  if (!planned?.exercises?.length) return undefined;

  return [...planned.exercises]
    .sort((a, b) => a.order - b.order)
    .map((exercise) => ({
      prescriptionId: exercise.id,
      name: exercise.name,
      notes: formatPlannedExerciseLine(exercise),
      completed
    }));
}

export function buildPlannedExercisesNotes(planned?: PlannedSession): string | undefined {
  if (!planned?.exercises?.length) return undefined;

  const lines = [...planned.exercises]
    .sort((a, b) => a.order - b.order)
    .map((exercise) => `- ${formatPlannedExerciseLine(exercise)}`);

  return `Exercices prévus :\n${lines.join("\n")}`;
}

export function mergeSessionNotesWithPlannedExercises(notes: string, planned?: PlannedSession): string | undefined {
  const trimmedNotes = notes.trim();
  const exerciseNotes = buildPlannedExercisesNotes(planned);

  if (!exerciseNotes) return trimmedNotes || undefined;
  if (!trimmedNotes) return exerciseNotes;
  if (trimmedNotes.includes("Exercices prévus :")) return trimmedNotes;

  return `${trimmedNotes}\n\n${exerciseNotes}`;
}
