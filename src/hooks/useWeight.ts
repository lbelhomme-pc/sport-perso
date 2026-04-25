import type { WeightEntry } from "../types";
import { deleteWeight, upsertWeight } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useWeight() {
  const data = useStoredData();
  const weights = [...data.weights].sort((a, b) => a.date.localeCompare(b.date));

  return {
    weights,
    saveWeight: (entry: WeightEntry) => upsertWeight(entry),
    deleteWeight
  };
}
