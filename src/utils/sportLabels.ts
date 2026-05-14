import { PLANNED_TYPE_LABELS, SESSION_TYPE_LABELS } from "../data/defaults";
import type { CompletedSessionType, PlannedSession, PlannedSessionType, Settings } from "../types";

export function isHyroxCompetitionMode(settings: Settings) {
  return settings.appMode === "competition" && (settings.targetEventType ?? "hyrox") === "hyrox";
}

export function getPlannedTypeLabel(type: PlannedSessionType, settings: Settings) {
  if (type === "hyrox" && !isHyroxCompetitionMode(settings)) return "Sport hybride";
  return PLANNED_TYPE_LABELS[type];
}

export function getCompletedTypeLabel(type: CompletedSessionType, settings: Settings) {
  if (type === "hyrox" && !isHyroxCompetitionMode(settings)) return "Sport hybride";
  return SESSION_TYPE_LABELS[type];
}

export function getProgramLabel(settings: Settings) {
  return isHyroxCompetitionMode(settings) ? "Programme HYROX" : "Programme sportif";
}

export function hideHyroxWhenGeneral(text: string | undefined, settings: Settings) {
  if (!text || isHyroxCompetitionMode(settings)) return text ?? "";

  return text
    .replace(/HYROX Paris Porte de Versailles/gi, "objectif sportif")
    .replace(/HYROX/gi, "sport hybride")
    .replace(/comp[eé]tition\s+sport hybride/gi, "programme spécifique")
    .replace(/mode\s+sport hybride/gi, "mode sportif");
}

export function personalizePlannedSession(session: PlannedSession, settings: Settings): PlannedSession {
  if (isHyroxCompetitionMode(settings)) return session;

  return {
    ...session,
    title: hideHyroxWhenGeneral(session.title, settings),
    objective: hideHyroxWhenGeneral(session.objective, settings),
    fatigueVersion: hideHyroxWhenGeneral(session.fatigueVersion, settings),
    normalVersion: hideHyroxWhenGeneral(session.normalVersion, settings),
    strongVersion: hideHyroxWhenGeneral(session.strongVersion, settings),
    tags: session.tags.map((tag) => hideHyroxWhenGeneral(tag, settings)),
    exercises: session.exercises?.map((exercise) => ({
      ...exercise,
      block: hideHyroxWhenGeneral(exercise.block, settings),
      name: hideHyroxWhenGeneral(exercise.name, settings),
      repsText: exercise.repsText ? hideHyroxWhenGeneral(exercise.repsText, settings) : exercise.repsText,
      targetLoadText: exercise.targetLoadText ? hideHyroxWhenGeneral(exercise.targetLoadText, settings) : exercise.targetLoadText,
      rpeTarget: exercise.rpeTarget ? hideHyroxWhenGeneral(exercise.rpeTarget, settings) : exercise.rpeTarget,
      techniqueNotes: exercise.techniqueNotes?.map((note) => hideHyroxWhenGeneral(note, settings)),
      fatigueAdjustment: exercise.fatigueAdjustment ? hideHyroxWhenGeneral(exercise.fatigueAdjustment, settings) : exercise.fatigueAdjustment,
      strongAdjustment: exercise.strongAdjustment ? hideHyroxWhenGeneral(exercise.strongAdjustment, settings) : exercise.strongAdjustment
    }))
  };
}
