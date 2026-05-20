import { Check, RotateCcw } from "lucide-react";
import { GENERAL_SPORT_MODES, SESSION_TYPE_LABELS } from "../../data/defaults";
import {
  deriveNavigationFocusFromModules,
  MAX_PRIMARY_TABS,
  moduleOrder,
  modulesConfig,
  recommendedModulesByGoal,
  resolveModulePreferences
} from "../../data/modules";
import type { AppExperienceMode, AppModuleId, NutritionTrackingMode, Settings, SportType, UserSportLevel } from "../../types";
import { applyNutritionModeToModules } from "../../utils/nutritionMode";
import { StatusBadge } from "../ui/StatusBadge";

type ExperiencePanelProps = {
  settings: Settings;
  onSave: (settings: Settings) => void;
};

const sportOptions: SportType[] = ["strength", "run", "badminton", "racket", "hybrid", "bike", "swim", "mobility", "recovery", "free", "hyrox"];

const levelOptions: Array<{ id: UserSportLevel; label: string }> = [
  { id: "beginner", label: "Débutant" },
  { id: "intermediate", label: "Intermédiaire" },
  { id: "advanced", label: "Confirmé" }
];

const quickModuleIds: AppModuleId[] = ["training", "sessions", "nutrition", "progress", "recovery", "calendar", "weight"];
const fixedTabs = new Set<AppModuleId>(["home", "profile"]);
const fallbackSports: SportType[] = ["strength", "run", "recovery"];

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
  const noSensitiveWeight = settings.eatingDisorderHistory
    ? uniqueEnabled.filter((moduleId) => moduleId !== "weight")
    : uniqueEnabled;
  const safeTabs = settings.eatingDisorderHistory
    ? primaryTabs.filter((moduleId) => moduleId !== "weight")
    : primaryTabs;

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
  const selectedSports: SportType[] = settings.enabledSports?.length ? settings.enabledSports : fallbackSports;
  const activeGoal = settings.appMode ?? "fitness";
  const recommended = recommendedModulesByGoal[activeGoal];
  const recommendedVisible = recommended.tabs.filter((moduleId) => preferences.enabledModules.includes(moduleId) || moduleId === "nutrition");
  const remainingTabs = Math.max(0, MAX_PRIMARY_TABS - primaryTabs.length);

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
    const primaryModuleTabs = enabledSet.has(moduleId)
      ? primaryTabs.filter((item) => item !== moduleId)
      : primaryTabs;

    saveModules(enabledModules, primaryModuleTabs);
  };

  const togglePrimaryTab = (moduleId: AppModuleId) => {
    if (fixedTabs.has(moduleId) || !enabledSet.has(moduleId)) return;

    if (primaryTabs.includes(moduleId)) {
      saveModules(preferences.enabledModules, primaryTabs.filter((item) => item !== moduleId));
      return;
    }

    if (primaryTabs.length >= MAX_PRIMARY_TABS) return;
    saveModules(preferences.enabledModules, [...primaryTabs.filter((item) => item !== "profile"), moduleId, "profile"]);
  };

  const toggleSport = (sport: SportType) => {
    const nextSports = selectedSports.includes(sport)
      ? selectedSports.filter((item) => item !== sport)
      : [...selectedSports, sport];

    saveExperience({ enabledSports: nextSports.length ? nextSports : (["free"] as SportType[]) });
  };

  const setGoal = (goal: AppExperienceMode) => {
    saveExperience({ appMode: goal });
  };

  const applyRecommended = () => {
    const nutritionMode: NutritionTrackingMode = recommended.enabled.includes("nutrition")
      ? settings.eatingDisorderHistory
        ? "no-calories"
        : getRecommendedNutritionMode(activeGoal, settings.nutritionMode)
      : "disabled";
    const guarded = applyNutritionModeToModules(nutritionMode, recommended.enabled, recommended.tabs);
    const normalized = normalizePreferences(settings, guarded.enabledModules, guarded.primaryModuleTabs);

    saveExperience({
      enabledModules: normalized.enabledModules,
      primaryModuleTabs: normalized.primaryModuleTabs,
      nutritionMode,
      navigationFocus: deriveNavigationFocusFromModules(normalized.enabledModules)
    });
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
    <section className="panel p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="title-lg">Mon expérience</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Ajuste ce que l'app affiche. Rien n'est supprimé, les modules masqués restent réactivables.
          </p>
        </div>
        <button type="button" className="ghost-button justify-center sm:w-fit" onClick={applyRecommended}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Recommandé
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="field-label">
          Objectif principal
          <select className="field" value={activeGoal} onChange={(event) => setGoal(event.target.value as AppExperienceMode)}>
            {GENERAL_SPORT_MODES.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-card border border-petrol-800/10 bg-mist/45 p-3">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">Aperçu des onglets</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {primaryTabs.map((moduleId, index) => {
              const module = modulesConfig[moduleId];

              return (
                <StatusBadge key={`${moduleId}-${index}`} icon={module.icon} tone={moduleId === "home" || moduleId === "profile" ? "dark" : "lime"}>
                  {index + 1}. {module.shortLabel}
                </StatusBadge>
              );
            })}
          </div>
          <p className="mt-2 text-xs font-bold text-muted">
            {primaryTabs.length}/{MAX_PRIMARY_TABS} onglets visibles. {remainingTabs > 0 ? `${remainingTabs} place(s) disponible(s).` : "Menu plein."}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <label className="field-label">
            Niveau
            <select
              className="field"
              value={settings.sportLevel ?? "intermediate"}
              onChange={(event) => saveExperience({ sportLevel: event.target.value as UserSportLevel })}
            >
              {levelOptions.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-card border border-petrol-800/10 bg-white/70 p-3">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">Configuration recommandée</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendedVisible.slice(0, MAX_PRIMARY_TABS).map((moduleId) => {
                const module = modulesConfig[moduleId];

                return (
                  <StatusBadge key={moduleId} icon={module.icon} tone="muted">
                    {module.shortLabel}
                  </StatusBadge>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <p className="field-label">Sports pratiqués</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sportOptions.map((sport) => {
              const active = selectedSports.includes(sport);

              return (
                <button
                  key={sport}
                  type="button"
                  className={`chip transition duration-200 ease-out ${
                    active ? "bg-petrol-800 text-white ring-petrol-800/20" : "bg-white/75 text-muted hover:bg-white hover:text-petrol-800"
                  }`}
                  onClick={() => toggleSport(sport)}
                >
                  {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {SESSION_TYPE_LABELS[sport]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <ExperienceSwitch
            label="Nutrition"
            description="Repas, protéines et suivi alimentaire."
            enabled={enabledSet.has("nutrition") && settings.nutritionMode !== "disabled"}
            onToggle={(enabled) => setNutritionEnabled(enabled)}
          />
          <ExperienceSwitch
            label="Stats détaillées"
            description="Tendances, graphiques et progression."
            enabled={enabledSet.has("progress")}
            onToggle={(enabled) => setModuleEnabled("progress", enabled)}
          />
          <ExperienceSwitch
            label="Récupération"
            description="Fatigue, sommeil, douleur et signaux utiles."
            enabled={enabledSet.has("recovery")}
            onToggle={(enabled) => setModuleEnabled("recovery", enabled)}
          />
        </div>

        <div>
          <p className="field-label">Modules actifs</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>

        <div>
          <p className="field-label">Onglets principaux</p>
          <div className="mt-2 flex flex-wrap gap-2">
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
        </div>
      </div>
    </section>
  );
}

function ExperienceSwitch({
  label,
  description,
  enabled,
  onToggle
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`interactive-card rounded-card border p-4 text-left shadow-sm ${
        enabled ? "border-limeSoft/70 bg-limeSoft/35" : "border-petrol-800/10 bg-white/75"
      }`}
      aria-pressed={enabled}
      onClick={() => onToggle(!enabled)}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-black text-petrol-800">{label}</span>
          <span className="mt-1 block text-xs font-bold leading-5 text-muted">{description}</span>
        </span>
        <span className={`mt-0.5 h-6 w-11 rounded-full p-1 transition ${enabled ? "bg-petrol-800" : "bg-mist"}`}>
          <span className={`block h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-5" : ""}`} />
        </span>
      </span>
    </button>
  );
}
