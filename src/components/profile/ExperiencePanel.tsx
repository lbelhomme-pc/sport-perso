import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { GENERAL_SPORT_MODES, SESSION_TYPE_LABELS } from "../../data/defaults";
import { deriveNavigationFocusFromModules, MAX_PRIMARY_TABS, moduleOrder, modulesConfig, resolveModulePreferences } from "../../data/modules";
import type { AppExperienceMode, AppModuleId, NutritionTrackingMode, Settings, SportType } from "../../types";
import { applyNutritionModeToModules } from "../../utils/nutritionMode";

type ExperiencePanelProps = {
  settings: Settings;
  onSave: (settings: Settings) => void;
};

const sportGroups: Array<{ title: string; sports: SportType[] }> = [
  { title: "Base", sports: ["strength", "run", "walk", "mobility", "recovery", "free"] },
  { title: "Endurance", sports: ["bike", "swim", "rowing", "elliptical", "hiking", "trail"] },
  { title: "Raquette", sports: ["badminton", "racket", "tennis", "padel"] },
  { title: "Collectif", sports: ["football", "basketball"] },
  { title: "Force / combat", sports: ["boxing", "martial", "hybrid", "hyrox"] },
  { title: "Bien-être", sports: ["yoga", "pilates", "dance", "climbing", "ski", "test"] }
];

const quickModuleIds: AppModuleId[] = ["training", "sessions", "nutrition", "progress", "recovery", "calendar", "weight"];
const fixedTabs = new Set<AppModuleId>(["home", "profile"]);

function cleanTabs(enabledModules: AppModuleId[], tabs: AppModuleId[]) {
  const enabledSet = new Set(enabledModules);
  const middleTabs = tabs
    .filter((moduleId) => !fixedTabs.has(moduleId))
    .filter((moduleId, index, list) => list.indexOf(moduleId) === index)
    .filter((moduleId) => enabledSet.has(moduleId) && modulesConfig[moduleId]?.canBeMainTab)
    .slice(0, MAX_PRIMARY_TABS - 2);

  return ["home" as AppModuleId, ...middleTabs, "profile" as AppModuleId];
}

function normalizePreferences(settings: Settings, enabledModules: AppModuleId[], primaryTabs: AppModuleId[]) {
  const uniqueEnabled = moduleOrder.filter((moduleId) => enabledModules.includes(moduleId) || fixedTabs.has(moduleId));
  const noSensitiveWeight = settings.eatingDisorderHistory ? uniqueEnabled.filter((moduleId) => moduleId !== "weight") : uniqueEnabled;
  const safeTabs = settings.eatingDisorderHistory ? primaryTabs.filter((moduleId) => moduleId !== "weight") : primaryTabs;

  return {
    enabledModules: noSensitiveWeight,
    primaryModuleTabs: cleanTabs(noSensitiveWeight, safeTabs)
  };
}

function getRecommendedNutritionMode(goal: AppExperienceMode, currentMode: NutritionTrackingMode | undefined): NutritionTrackingMode {
  if (currentMode && currentMode !== "disabled") return currentMode;
  if (goal === "weight-loss") return "fat-loss-prudent";
  if (goal === "muscle-gain") return "muscle-gain";
  if (goal === "performance" || goal === "competition" || goal === "hybrid") return "performance";
  return "simple";
}

export function ExperiencePanel({ settings, onSave }: ExperiencePanelProps) {
  const preferences = resolveModulePreferences(settings);
  const primaryTabs = preferences.primaryModuleTabs;
  const enabledSet = new Set(preferences.enabledModules);
  const selectedSports: SportType[] = settings.enabledSports ?? [];
  const activeGoal = settings.appMode ?? "fitness";

  const saveExperience = (patch: Partial<Settings>) => {
    onSave({ ...settings, ...patch, updatedAt: new Date().toISOString() });
  };

  const saveModules = (enabledModules: AppModuleId[], primaryModuleTabs = primaryTabs) => {
    const next = normalizePreferences(settings, enabledModules, primaryModuleTabs);
    const nutritionMode = next.enabledModules.includes("nutrition")
      ? settings.nutritionMode === "disabled"
        ? "simple"
        : settings.nutritionMode ?? "simple"
      : "disabled";
    const guarded = applyNutritionModeToModules(nutritionMode, next.enabledModules, next.primaryModuleTabs);
    const normalized = normalizePreferences(settings, guarded.enabledModules, guarded.primaryModuleTabs);

    saveExperience({
      ...normalized,
      nutritionMode,
      navigationFocus: deriveNavigationFocusFromModules(normalized.enabledModules)
    });
  };

  const toggleModule = (moduleId: AppModuleId) => {
    if (fixedTabs.has(moduleId)) return;
    const enabledModules = enabledSet.has(moduleId)
      ? preferences.enabledModules.filter((item) => item !== moduleId)
      : [...preferences.enabledModules, moduleId];
    const primaryModuleTabs = enabledSet.has(moduleId) ? primaryTabs.filter((item) => item !== moduleId) : primaryTabs;

    saveModules(enabledModules, primaryModuleTabs);
  };

  const togglePrimaryTab = (moduleId: AppModuleId) => {
    if (fixedTabs.has(moduleId) || !enabledSet.has(moduleId)) return;

    if (primaryTabs.includes(moduleId)) {
      saveModules(
        preferences.enabledModules,
        primaryTabs.filter((item) => item !== moduleId)
      );
      return;
    }

    if (primaryTabs.length >= MAX_PRIMARY_TABS) return;
    saveModules(preferences.enabledModules, [...primaryTabs.filter((item) => item !== "profile"), moduleId, "profile"]);
  };

  const toggleSport = (sport: SportType) => {
    const nextSports = selectedSports.includes(sport)
      ? selectedSports.filter((item) => item !== sport)
      : [...selectedSports, sport];

    saveExperience({ enabledSports: nextSports });
  };

  const setGoal = (goal: AppExperienceMode) => {
    saveExperience({ appMode: goal });
  };

  const setNutritionEnabled = (enabled: boolean) => {
    const nutritionMode: NutritionTrackingMode = enabled
      ? settings.eatingDisorderHistory
        ? "no-calories"
        : getRecommendedNutritionMode(activeGoal, settings.nutritionMode)
      : "disabled";
    const nextEnabled = enabled
      ? [...preferences.enabledModules, "nutrition" as AppModuleId]
      : preferences.enabledModules.filter((moduleId) => moduleId !== "nutrition");
    const guarded = applyNutritionModeToModules(nutritionMode, nextEnabled, primaryTabs);
    const normalized = normalizePreferences(settings, guarded.enabledModules, guarded.primaryModuleTabs);

    saveExperience({
      enabledModules: normalized.enabledModules,
      primaryModuleTabs: normalized.primaryModuleTabs,
      nutritionMode,
      navigationFocus: deriveNavigationFocusFromModules(normalized.enabledModules)
    });
  };

  const setModuleEnabled = (moduleId: AppModuleId, enabled: boolean) => {
    if (enabledSet.has(moduleId) === enabled) return;
    toggleModule(moduleId);
  };

  return (
    <section id="experience" className="panel scroll-mt-24 p-4 sm:p-5">
      <div>
        <h2 className="title-lg">Mon expérience</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-muted">
          Choisis seulement ce qui te sert. Tout reste réactivable plus tard.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <ExperienceSection title="Objectif principal" summary={GENERAL_SPORT_MODES.find((mode) => mode.id === activeGoal)?.label ?? "Libre"}>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {GENERAL_SPORT_MODES.map((mode) => {
              const selected = activeGoal === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`interactive-card min-h-11 rounded-card border p-3 text-left text-sm font-black transition ${
                    selected
                      ? "border-petrol-800 bg-petrol-800 text-white shadow-sm"
                      : "border-petrol-800/10 bg-white/75 text-petrol-800 hover:bg-white"
                  }`}
                  aria-pressed={selected}
                  onClick={() => setGoal(mode.id)}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </ExperienceSection>

        <ExperienceSection title="Sports pratiqués" summary={`${selectedSports.length} sélectionné${selectedSports.length > 1 ? "s" : ""}`}>
          <div className="grid gap-4">
            {sportGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">{group.title}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {group.sports.map((sport) => {
                    const active = selectedSports.includes(sport);

                    return (
                      <label
                        key={sport}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-card border px-3 py-2 text-sm font-black transition ${
                          active
                            ? "border-petrol-800/20 bg-limeSoft/45 text-petrol-900"
                            : "border-petrol-800/10 bg-white/75 text-muted hover:bg-white hover:text-petrol-800"
                        }`}
                      >
                        <input
                          className="h-4 w-4 accent-petrol-800"
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleSport(sport)}
                        />
                        {SESSION_TYPE_LABELS[sport]}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ExperienceSection>

        <ExperienceSection title="Options rapides" summary="Nutrition, stats, récupération">
          <div className="grid gap-3 lg:grid-cols-3">
            <ExperienceSwitch
              label="Nutrition"
              enabled={enabledSet.has("nutrition") && settings.nutritionMode !== "disabled"}
              onToggle={(enabled) => setNutritionEnabled(enabled)}
            />
            <ExperienceSwitch
              label="Stats détaillées"
              enabled={enabledSet.has("progress")}
              onToggle={(enabled) => setModuleEnabled("progress", enabled)}
            />
            <ExperienceSwitch
              label="Récupération"
              enabled={enabledSet.has("recovery")}
              onToggle={(enabled) => setModuleEnabled("recovery", enabled)}
            />
          </div>
        </ExperienceSection>

        <ExperienceSection title="Modules visibles" summary={`${preferences.enabledModules.length} actifs`}>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {quickModuleIds.map((moduleId) => {
              const module = modulesConfig[moduleId];
              const enabled = enabledSet.has(moduleId);

              return (
                <button
                  key={moduleId}
                  type="button"
                  className={`interactive-card rounded-card border p-3 text-left shadow-sm ${
                    enabled ? "border-petrol-800/15 bg-white/85" : "border-petrol-800/10 bg-mist/45 text-muted"
                  }`}
                  onClick={() => toggleModule(moduleId)}
                >
                  <span className="flex items-start gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${enabled ? "bg-petrol-800 text-limeSoft" : "bg-white/75 text-muted"}`}>
                      <module.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-petrol-800">{module.label}</span>
                      <span className="mt-1 block text-xs font-bold leading-5 text-muted">{enabled ? "Actif" : "Masqué"}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </ExperienceSection>

        <ExperienceSection title="Onglets principaux" summary={`${primaryTabs.length}/${MAX_PRIMARY_TABS}`}>
          <div className="flex flex-wrap gap-2">
            {preferences.enabledModules
              .filter((moduleId) => modulesConfig[moduleId].canBeMainTab)
              .map((moduleId) => {
                const module = modulesConfig[moduleId];
                const selected = primaryTabs.includes(moduleId);
                const locked = fixedTabs.has(moduleId);
                const disabled = !selected && primaryTabs.length >= MAX_PRIMARY_TABS;

                return (
                  <button
                    key={moduleId}
                    type="button"
                    className={`chip transition duration-200 ease-out ${
                      selected ? "bg-limeSoft text-petrol-900 ring-limeSoft/70" : "bg-white/75 text-muted hover:bg-white hover:text-petrol-800"
                    } ${disabled || locked ? "cursor-not-allowed opacity-75" : ""}`}
                    disabled={locked || disabled}
                    onClick={() => togglePrimaryTab(moduleId)}
                    title={locked ? "Toujours visible" : disabled ? "Maximum 5 onglets" : undefined}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    {module.shortLabel}
                  </button>
                );
              })}
          </div>
        </ExperienceSection>
      </div>
    </section>
  );
}

function ExperienceSection({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return (
    <details className="group rounded-card border border-petrol-800/10 bg-white/70 p-3 shadow-sm">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-black text-petrol-800">{title}</span>
        <span className="text-right text-xs font-black uppercase tracking-[0.08em] text-muted group-open:hidden">{summary}</span>
        <span className="hidden text-xs font-black uppercase tracking-[0.08em] text-muted group-open:inline">Fermer</span>
      </summary>
      <div className="mt-3 border-t border-petrol-800/10 pt-3">{children}</div>
    </details>
  );
}

function ExperienceSwitch({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      className={`interactive-card rounded-card border p-4 text-left shadow-sm ${
        enabled ? "border-limeSoft/70 bg-limeSoft/35" : "border-petrol-800/10 bg-white/75"
      }`}
      aria-pressed={enabled}
      onClick={() => onToggle(!enabled)}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="block text-sm font-black text-petrol-800">{label}</span>
        <span className={`h-6 w-11 rounded-full p-1 transition ${enabled ? "bg-petrol-800" : "bg-mist"}`}>
          <span className={`block h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-5" : ""}`} />
        </span>
      </span>
    </button>
  );
}
