import { MAIN_NAVIGATION_ORDER, MAX_PRIMARY_TABS, moduleOrder, modulesConfig } from "../../data/modules";
import type { AppModuleId } from "../../types";
import { ModuleToggle } from "../ui/ModuleToggle";

type ModulePreferencesEditorProps = {
  enabledModules: AppModuleId[];
  primaryModuleTabs?: AppModuleId[];
  onChange: (next: { enabledModules: AppModuleId[]; primaryModuleTabs: AppModuleId[] }) => void;
};

const lockedModules = new Set<AppModuleId>(["home", "profile"]);

function getMainTabs(enabledModules: AppModuleId[], preferredTabs?: AppModuleId[]) {
  const requested = preferredTabs?.length ? preferredTabs : MAIN_NAVIGATION_ORDER;
  const middleTabs = requested
    .filter((moduleId) => moduleId !== "home" && moduleId !== "profile")
    .filter((moduleId, index, list) => list.indexOf(moduleId) === index)
    .filter((moduleId) => enabledModules.includes(moduleId) && modulesConfig[moduleId]?.canBeMainTab)
    .slice(0, MAX_PRIMARY_TABS - 2);

  return ["home" as AppModuleId, ...middleTabs, "profile" as AppModuleId];
}

export function ModulePreferencesEditor({ enabledModules, primaryModuleTabs, onChange }: ModulePreferencesEditorProps) {
  const enabledSet = new Set(enabledModules);
  const mainTabs = getMainTabs(enabledModules, primaryModuleTabs);

  const save = (nextEnabled: AppModuleId[], preferredTabs = mainTabs) => {
    const cleanEnabled = moduleOrder.filter((moduleId) => nextEnabled.includes(moduleId) || lockedModules.has(moduleId));
    const nextTabs = getMainTabs(cleanEnabled, preferredTabs);

    onChange({
      enabledModules: cleanEnabled,
      primaryModuleTabs: nextTabs
    });
  };

  const toggleModule = (moduleId: AppModuleId) => {
    if (lockedModules.has(moduleId)) return;
    const nextEnabled = enabledSet.has(moduleId)
      ? enabledModules.filter((item) => item !== moduleId)
      : [...enabledModules, moduleId];
    const nextTabs =
      !enabledSet.has(moduleId) && modulesConfig[moduleId]?.canBeMainTab && mainTabs.length < MAX_PRIMARY_TABS
        ? [...mainTabs.filter((item) => item !== "profile"), moduleId, "profile" as AppModuleId]
        : mainTabs;

    save(nextEnabled, nextTabs);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {moduleOrder.map((moduleId) => {
        const module = modulesConfig[moduleId];
        const enabled = enabledSet.has(moduleId);
        const locked = lockedModules.has(moduleId);
        const locationLabel = !enabled ? "Masqué" : mainTabs.includes(moduleId) ? "Menu" : "Plus";

        return (
          <ModuleToggle
            key={moduleId}
            icon={module.icon}
            label={module.label}
            description={module.description}
            enabled={enabled}
            locked={locked}
            statusLabel={locationLabel}
            onToggle={() => toggleModule(moduleId)}
          />
        );
      })}
    </div>
  );
}
