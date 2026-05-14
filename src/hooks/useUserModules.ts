import { modulesConfig, resolveModulePreferences } from "../data/modules";
import type { AppModuleId, Settings } from "../types";
import { useSettings } from "./useSettings";

export function useUserModules() {
  const { settings, saveSettings } = useSettings();
  const preferences = resolveModulePreferences(settings);

  const isEnabled = (moduleId: AppModuleId) => preferences.enabledModules.includes(moduleId);

  const saveModulePreferences = (next: Pick<Settings, "enabledModules" | "primaryModuleTabs">) => {
    saveSettings({
      ...settings,
      enabledModules: next.enabledModules,
      primaryModuleTabs: next.primaryModuleTabs
    });
  };

  return {
    settings,
    modules: modulesConfig,
    enabledModules: preferences.enabledModules,
    primaryModuleTabs: preferences.primaryModuleTabs,
    isEnabled,
    saveModulePreferences,
    saveSettings
  };
}
