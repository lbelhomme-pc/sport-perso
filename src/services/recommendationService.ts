import type { CompletedSession, DailyContext, DashboardAlert, Meal, Settings, WeightEntry, WeekSummary } from "../types";
import { getMealTotals, getProteinTarget } from "../utils/nutrition";
import { getDailyDeficit } from "../utils/calories";
import { parseISO, subDays } from "date-fns";
import { tracksNutritionNumbers } from "../utils/nutritionMode";

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
  recentDailyContexts?: DailyContext[];
  weights: WeightEntry[];
  weekSummary: WeekSummary;
  maintenanceCalorieTarget?: number;
}): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];
  const mealTotals = getMealTotals(args.todayMeals);
  const dailyDeficit = getDailyDeficit(args.todayMeals, args.maintenanceCalorieTarget ?? args.settings.dailyCalorieTarget);
  const proteinTarget = getProteinTarget(args.settings.defaultBodyWeight, args.settings.proteinPerKg);
  const intenseRecent = args.recentSessions.filter((session) => (session.rpe ?? 0) >= 8).length;
  const painfulRecentSessions = args.recentSessions.filter((session) => session.pain || (session.painDuring ?? 0) >= 4).length;
  const fatigueDays = args.recentDailyContexts?.filter((context) => context.energyLevel === "fatigue" || (context.fatigueMorning ?? 0) >= 7).length ?? 0;
  const badSleepDays = args.recentDailyContexts?.filter((context) => context.sleepQuality === "bad").length ?? 0;
  const painDays = args.recentDailyContexts?.filter((context) => context.pain || (context.painMorning ?? 0) >= 4).length ?? 0;
  const hungryDays = args.recentDailyContexts?.filter((context) => (context.hungerLevel ?? 0) >= 8).length ?? 0;
  const highPainTrainingSessions = args.recentSessions.filter((session) => (session.painDuring ?? 0) >= 7).length;
  const highFatigueTrainingSessions = args.recentSessions.filter((session) => (session.fatigueDuring ?? 0) >= 8).length;
  const sevenDayTrend = getWeightTrend(args.weights, 7);
  const showNutritionNumbers = tracksNutritionNumbers(args.settings);

  if (intenseRecent >= 3) {
    alerts.push({
      id: "intensity",
      tone: "warning",
      title: "Charge intense rapprochée",
      message: "Tu as au moins 3 séances RPE 8+ récentes. Passe la prochaine séance en version normale ou fatiguée."
    });
  }

  if (painfulRecentSessions >= 2 || painDays >= 3 || highPainTrainingSessions >= 1) {
    alerts.push({
      id: "pain-persistent",
      tone: "danger",
      title: "Douleur persistante",
      message: "Douleur qui modifie ta foulée ou ta technique : stop séance intense et avis professionnel si ça persiste."
    });
  }

  if (fatigueDays >= 3 || highFatigueTrainingSessions >= 2) {
    alerts.push({
      id: "fatigue-chronic",
      tone: "warning",
      title: "Fatigue qui s'accumule",
      message: "Fatigue élevée au réveil ou pendant plusieurs séances. Passe la prochaine séance en version courte ou récupération active."
    });
  }

  if (showNutritionNumbers && dailyDeficit > args.settings.targetDailyDeficit + 350) {
    alerts.push({
      id: "deficit",
      tone: "danger",
      title: "Déficit trop agressif",
      message:
        hungryDays >= 1
          ? "Déficit élevé + faim marquée : ajoute un repas simple protéiné/glucides et évite de transformer la perte de poids en fatigue."
          : "Le déficit réel estimé dépasse la cible de plus de 350 kcal. Ajoute un repas simple protéiné/glucides pour protéger la récup."
    });
  }

  if (showNutritionNumbers && mealTotals.protein > 0 && mealTotals.protein < proteinTarget * 0.75) {
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
      message:
        fatigueDays >= 2 && badSleepDays >= 2
          ? "Perte rapide + fatigue + sommeil mauvais : augmente l'apport ou réduis la charge."
          : fatigueDays >= 2 || badSleepDays >= 2
            ? "Perte rapide avec fatigue ou sommeil fragile : augmente légèrement l'apport ou allège la charge."
            : "La tendance 7 jours baisse vite. Regarde la moyenne longue, pas seulement le poids du jour."
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
