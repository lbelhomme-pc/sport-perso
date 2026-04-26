import type { DailyHabitType } from "../types";
import { toggleDailyHabit } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export const DAILY_HABIT_LABELS: Record<DailyHabitType, string> = {
  allergies: "Allergies",
  duolingo: "Duolingo",
  omega3: "Oméga-3",
  creatine: "Créatine"
};

export function useDailyHabits(date?: string) {
  const data = useStoredData();

  return {
    dailyHabits: data.dailyHabits,
    getHabit: (habitDate: string, type: DailyHabitType) =>
      data.dailyHabits.find((item) => item.date === habitDate && item.type === type)?.completed ?? false,
    todayHabits: date ? data.dailyHabits.filter((item) => item.date === date) : [],
    toggleHabit: toggleDailyHabit
  };
}
