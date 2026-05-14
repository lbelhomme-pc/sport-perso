import { subDays } from "date-fns";
import { getPlannedWeek } from "../data/trainingPlan";
import { generateDashboardAlerts } from "../services/recommendationService";
import { getAdaptiveDailyCalorieTarget, getDailyDeficit, getRemainingCaloriesToTarget, getSportCalories } from "../utils/calories";
import { getCurrentWeekIndex, getWeekDays, getWeekStart, toISODate } from "../utils/dates";
import { getMealTotals } from "../utils/nutrition";
import { summarizeWeek } from "../utils/training";
import { useStoredData } from "./useStoredData";

export function useDashboard() {
  const data = useStoredData();
  const today = toISODate(new Date());
  const yesterday = toISODate(subDays(new Date(), 1));
  const currentWeek = getCurrentWeekIndex(data.settings.startDate, data.settings.targetDate);
  const currentWeekStart = getWeekStart(data.settings.startDate, currentWeek);
  const plannedWeek = getPlannedWeek(data.settings, currentWeek, data.settings.badmintonVariant);
  const todayPlanned = plannedWeek.find((session) => session.date === today);
  const yesterdayPlanned = plannedWeek.find((session) => session.date === yesterday);
  const todayMeals = data.meals.filter((meal) => meal.date === today);
  const todaySessions = data.sessions.filter((session) => session.date === today);
  const yesterdaySessions = data.sessions.filter((session) => session.date === yesterday && session.completed);
  const todayContext = data.dailyContexts.find((context) => context.date === today);
  const latestWeight = [...data.weights].sort((a, b) => b.date.localeCompare(a.date))[0];
  const todayMealTotals = getMealTotals(todayMeals);
  const todaySportCalories = getSportCalories(todaySessions);
  const calculationWeight = latestWeight?.weight ?? data.settings.defaultBodyWeight;
  const adaptiveCalorieTarget = getAdaptiveDailyCalorieTarget({
    settings: data.settings,
    plannedSession: todayPlanned,
    sessions: todaySessions,
    energyLevel: todayContext?.energyLevel,
    steps: todayContext?.steps,
    floors: todayContext?.floors,
    bodyWeightKg: calculationWeight
  });
  const remainingCalories = getRemainingCaloriesToTarget(todayMeals, adaptiveCalorieTarget.target);
  const dailyDeficit = getDailyDeficit(todayMeals, adaptiveCalorieTarget.maintenanceTarget);
  const weekSummary = summarizeWeek(currentWeek, currentWeekStart, plannedWeek, data.sessions);
  const weekDays = getWeekDays(currentWeekStart);
  const weekMeals = data.meals.filter((meal) => weekDays.includes(meal.date));
  const weekMealTotals = getMealTotals(weekMeals);
  const recentCutoff = toISODate(subDays(new Date(), 6));
  const recentSessions = data.sessions.filter((session) => session.date >= recentCutoff);
  const recentDailyContexts = data.dailyContexts.filter((context) => context.date >= recentCutoff);
  const alerts = generateDashboardAlerts({
    settings: data.settings,
    todayMeals,
    todaySessions,
    recentSessions,
    recentDailyContexts,
    weights: data.weights,
    weekSummary,
    maintenanceCalorieTarget: adaptiveCalorieTarget.maintenanceTarget
  });

  return {
    settings: data.settings,
    allSessions: data.sessions,
    dailyContexts: data.dailyContexts,
    today,
    yesterday,
    currentWeek,
    plannedWeek,
    todayPlanned,
    yesterdayPlanned,
    todayMeals,
    todaySessions,
    yesterdaySessions,
    todayContext,
    todayMealTotals,
    todaySportCalories,
    adaptiveCalorieTarget,
    dailyDeficit,
    remainingCalories,
    weekSummary,
    weekMealTotals,
    latestWeight,
    calculationWeight,
    alerts
  };
}
