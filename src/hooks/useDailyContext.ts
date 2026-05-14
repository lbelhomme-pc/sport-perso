import type { DailyContext, EnergyLevel } from "../types";
import { upsertDailyContext } from "../services/storageService";
import { useStoredData } from "./useStoredData";
import { energyFromFatigueScore, hasMeaningfulPain } from "../utils/readiness";

export function useDailyContext(date: string) {
  const data = useStoredData();
  const dailyContext = data.dailyContexts.find((item) => item.date === date) ?? {
    date,
    energyLevel: "normal" as EnergyLevel,
    sleepQuality: "medium" as const,
    pain: false,
    fatigueMorning: 5,
    painMorning: 0,
    hungerLevel: 5,
    steps: 0,
    floors: 0,
    waterMl: 0
  };

  return {
    dailyContext,
    saveDailyContext: (context: DailyContext) =>
      upsertDailyContext({
        ...context,
        energyLevel: energyFromFatigueScore(context.fatigueMorning),
        pain: hasMeaningfulPain(context.painMorning, context.pain)
      })
  };
}
