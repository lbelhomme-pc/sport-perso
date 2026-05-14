import { MAX_PRIMARY_TABS, moduleOrder, modulesConfig } from "../../data/modules";
import type { AppModuleId } from "../../types";

type ModulePreferencesEditorProps = {
  enabledModules: AppModuleId[];
  primaryModuleTabs: AppModuleId[];
  onChange: (next: { enabledModules: AppModuleId[]; primaryModuleTabs: AppModuleId[] }) => void;
};

export function ModulePreferencesEditor({ enabledModules, primaryModuleTabs, onChange }: ModulePreferencesEditorProps) {
  const enabledSet = new Set(enabledModules);
  const tabSet = new Set(primaryModuleTabs);
  const tabCount = primaryModuleTabs.length;

  const save = (nextEnabled: AppModuleId[], nextTabs: AppModuleId[]) => {
    const cleanEnabled = moduleOrder.filter((moduleId) => nextEnabled.includes(moduleId) || moduleId === "home" || moduleId === "profile");
    const cleanTabs = nextTabs
      .filter((moduleId, index) => nextTabs.indexOf(moduleId) === index && cleanEnabled.includes(moduleId))
      .slice(0, MAX_PRIMARY_TABS);

    const nextPrimaryTabs: AppModuleId[] = cleanTabs.includes("home")
      ? cleanTabs
      : (["home" as AppModuleId, ...cleanTabs].slice(0, MAX_PRIMARY_TABS) as AppModuleId[]);

    onChange({
      enabledModules: cleanEnabled,
      primaryModuleTabs: nextPrimaryTabs
    });
  };

  const toggleModule = (moduleId: AppModuleId) => {
    if (moduleId === "home" || moduleId === "profile") return;
    const nextEnabled = enabledSet.has(moduleId)
      ? enabledModules.filter((item) => item !== moduleId)
      : [...enabledModules, moduleId];
    const nextTabs = primaryModuleTabs.filter((item) => nextEnabled.includes(item));
    save(nextEnabled, nextTabs);
  };

  const toggleTab = (moduleId: AppModuleId) => {
    if (!enabledSet.has(moduleId)) return;
    if (tabSet.has(moduleId)) {
      save(enabledModules, primaryModuleTabs.filter((item) => item !== moduleId));
      return;
    }
    if (tabCount >= MAX_PRIMARY_TABS) return;
    save(enabledModules, [...primaryModuleTabs, moduleId]);
  };

  const moveTab = (moduleId: AppModuleId, direction: -1 | 1) => {
    const index = primaryModuleTabs.indexOf(moduleId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= primaryModuleTabs.length) return;

    const nextTabs = [...primaryModuleTabs];
    const [item] = nextTabs.splice(index, 1);
    nextTabs.splice(targetIndex, 0, item);
    save(enabledModules, nextTabs);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Modules activés</p>
          <p className="mt-1 text-sm font-semibold text-muted">Un module désactivé disparaît des menus, cartes et raccourcis visibles.</p>
        </div>
        <span className="chip bg-limeSoft text-petrol-900">{tabCount}/{MAX_PRIMARY_TABS} onglets sélectionnés</span>
      </div>

      <div className="border border-petrol-800/10 bg-mist/45 p-3">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted">Aperçu du menu mobile</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {primaryModuleTabs.map((moduleId, index) => {
            const module = modulesConfig[moduleId];

            return (
              <span key={`${moduleId}-${index}`} className="inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-petrol-800">
                <module.icon className="h-4 w-4" aria-hidden="true" />
                {index + 1}. {module.shortLabel}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {moduleOrder.map((moduleId) => {
          const module = modulesConfig[moduleId];
          const enabled = enabledSet.has(moduleId);
          const inTabs = tabSet.has(moduleId);
          const tabLocked = moduleId === "home";
          const tabBlocked = enabled && !inTabs && tabCount >= MAX_PRIMARY_TABS;
          const locked = moduleId === "home" || moduleId === "profile";
          const tabButtonDisabled = tabLocked || !enabled || tabBlocked;
          const tabButtonLabel = tabLocked
            ? "Toujours affiché"
            : !enabled
              ? "Active d'abord"
              : inTabs
                ? "Retirer onglet"
                : tabBlocked
                  ? "Limite 5 atteinte"
                  : "Ajouter onglet";
          const tabIndex = primaryModuleTabs.indexOf(moduleId);

          return (
            <article key={moduleId} className={`border p-4 ${enabled ? "border-petrol-800/20 bg-white" : "border-petrol-800/10 bg-mist/40 opacity-75"}`}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
                  <module.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{module.label}</h3>
                  <p className="mt-1 text-sm font-semibold leading-5 text-muted">{module.description}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className={enabled ? "action-button justify-center" : "ghost-button justify-center"}
                  disabled={locked}
                  onClick={() => toggleModule(moduleId)}
                >
                  {locked ? "Activé" : enabled ? "Désactiver" : "Activer"}
                </button>
                <button
                  type="button"
                  className={inTabs ? "action-button justify-center bg-limeSoft text-petrol-900" : "ghost-button justify-center"}
                  disabled={tabButtonDisabled}
                  onClick={() => toggleTab(moduleId)}
                >
                  {tabButtonLabel}
                </button>
              </div>
              {inTabs ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="ghost-button min-h-10 justify-center px-3 py-2 text-xs"
                    disabled={tabIndex <= 0}
                    onClick={() => moveTab(moduleId, -1)}
                  >
                    Monter
                  </button>
                  <button
                    type="button"
                    className="ghost-button min-h-10 justify-center px-3 py-2 text-xs"
                    disabled={tabIndex < 0 || tabIndex >= primaryModuleTabs.length - 1}
                    onClick={() => moveTab(moduleId, 1)}
                  >
                    Descendre
                  </button>
                </div>
              ) : null}
              {tabBlocked ? <p className="mt-2 text-xs font-bold text-red-950">Retire un onglet avant d'en ajouter un autre.</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
