import type { DailyContext, EnergyLevel } from "../types";
import { upsertDailyContext } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useDailyContext(date: string) {
  const data = useStoredData();
  const dailyContext = data.dailyContexts.find((item) => item.date === date) ?? {
    date,
    energyLevel: "normal" as EnergyLevel,
    steps: 0,
    floors: 0
  };

  return {
    dailyContext,
    saveDailyContext: (context: DailyContext) => upsertDailyContext(context)
  };
}
