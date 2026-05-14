import type { EnergyLevel } from "../types";

export function clampReadinessScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Math.round(value)));
}

export function energyFromFatigueScore(score?: number): EnergyLevel {
  const value = clampReadinessScore(score ?? 5);
  if (value >= 7) return "fatigue";
  if (value <= 3) return "strong";
  return "normal";
}

export function hasMeaningfulPain(score?: number, fallbackPain = false): boolean {
  return clampReadinessScore(score ?? 0) >= 4 || fallbackPain;
}

export function readinessLabel(score?: number): string {
  const value = clampReadinessScore(score ?? 0);
  if (value >= 8) return "élevé";
  if (value >= 4) return "présent";
  if (value > 0) return "léger";
  return "aucun";
}
