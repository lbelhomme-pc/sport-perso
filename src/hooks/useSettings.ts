import type { Settings } from "../types";
import { updateSettings } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useSettings() {
  const data = useStoredData();

  return {
    settings: data.settings,
    saveSettings: (settings: Settings) => updateSettings(settings)
  };
}
