import type { CompletedSession, DashboardAlert, Meal, Settings, WeightEntry, WeekSummary } from "../types";
import { getMealTotals, getProteinTarget } from "../utils/nutrition";
import { getDailyDeficit } from "../utils/calories";
import { parseISO, subDays } from "date-fns";

function getRecentWeights(weights: WeightEntry[], days: number): WeightEntry[] {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  if (!latest) return [];

  const cutoff = subDays(parseISO(latest.date), Math.max(1, days) - 1);
  return sorted.filter((entry) => parseISO(entry.date) >= cutoff);
}

export function getWeightTrend(weights: WeightEntry[], days: number): number {
  const recent = getRecentWeights(weights, days);
  if (recent.length < 2) return 0;
  return Math.round((recent[recent.length - 1].weight - recent[0].weight) * 10) / 10;
}

export function generateDashboardAlerts(args: {
  settings: Settings;
  todayMeals: Meal[];
  todaySessions: CompletedSession[];
  recentSessions: CompletedSession[];
  weights: WeightEntry[];
  weekSummary: WeekSummary;
  maintenanceCalorieTarget?: number;
}): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];
  const mealTotals = getMealTotals(args.todayMeals);
  const dailyDeficit = getDailyDeficit(args.todayMeals, args.maintenanceCalorieTarget ?? args.settings.dailyCalorieTarget);
  const proteinTarget = getProteinTarget(args.settings.defaultBodyWeight, args.settings.proteinPerKg);
  const intenseRecent = args.recentSessions.filter((session) => (session.rpe ?? 0) >= 8).length;
  const sevenDayTrend = getWeightTrend(args.weights, 7);

  if (intenseRecent >= 3) {
    alerts.push({
      id: "intensity",
      tone: "warning",
      title: "Charge intense rapprochée",
      message: "Tu as au moins 3 séances RPE 8+ récentes. Passe la prochaine séance en version normale ou fatiguée."
    });
  }

  if (dailyDeficit > args.settings.targetDailyDeficit + 350) {
    alerts.push({
      id: "deficit",
      tone: "danger",
      title: "Déficit trop agressif",
      message: "Le déficit réel estimé dépasse la cible de plus de 350 kcal. Ajoute un repas simple protéiné/glucides pour protéger la récup."
    });
  }

  if (mealTotals.protein > 0 && mealTotals.protein < proteinTarget * 0.75) {
    alerts.push({
      id: "protein",
      tone: "warning",
      title: "Protéines basses",
      message: `Tu es sous 75 % de l’objectif protéines (${proteinTarget} g). Vise une prise facile au prochain repas.`
    });
  }

  if (sevenDayTrend <= -1) {
    alerts.push({
      id: "weight-fast",
      tone: "warning",
      title: "Poids en baisse rapide",
      message: "La tendance 7 jours baisse vite. Surveille sommeil, faim et qualité des séances."
    });
  }

  if (args.weekSummary.completed >= args.weekSummary.planned && args.weekSummary.planned > 0) {
    alerts.push({
      id: "week-good",
      tone: "success",
      title: "Semaine bien tenue",
      message: "Le volume prévu est couvert. Ne transforme pas le bonus en fatigue inutile."
    });
  }

  if (!alerts.length) {
    alerts.push({
      id: "steady",
      tone: "info",
      title: "Pilotage stable",
      message: "Rien d’alarmant aujourd’hui. Garde le cap : régularité, protéines, sommeil."
    });
  }

  return alerts;
}
