import { useState } from "react";
import { Download, Palette, RefreshCcw, Save, Upload } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { PwaInstallButton } from "../components/ui/PwaInstallButton";
import { ModulePreferencesEditor } from "../components/modules/ModulePreferencesEditor";
import { BadmintonVariantSelector } from "../components/planning/BadmintonVariantSelector";
import { GENERAL_SPORT_MODES } from "../data/defaults";
import { deriveNavigationFocusFromModules, MAX_PRIMARY_TABS, modulesConfig, recommendedModulesByGoal, resolveModulePreferences } from "../data/modules";
import { exportJson, getExportPreview, importJsonFile, mergeJsonFiles } from "../services/exportService";
import { resetData } from "../services/storageService";
import { useSettings } from "../hooks/useSettings";
import type { AppExperienceMode, AppTheme, BadmintonVariant, BmrSex, NutritionTrackingMode, Settings, UserSportLevel, WeekdayKey } from "../types";
import { calculateBasalMetabolicRate } from "../utils/calories";
import { applyNutritionModeToModules, getNutritionModeGuidance, getNutritionModeLabel } from "../utils/nutritionMode";
import { isHyroxCompetitionMode } from "../utils/sportLabels";

function parseVacationWeeks(value: string): number[] {
  return [
    ...new Set(
      value
        .split(/[,;\s]+/)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0)
    )
  ].sort((a, b) => a - b);
}

const dayOptions: Array<{ id: WeekdayKey; label: string }> = [
  { id: "monday", label: "Lun" },
  { id: "tuesday", label: "Mar" },
  { id: "wednesday", label: "Mer" },
  { id: "thursday", label: "Jeu" },
  { id: "friday", label: "Ven" },
  { id: "saturday", label: "Sam" },
  { id: "sunday", label: "Dim" }
];

const nutritionModeOptions: NutritionTrackingMode[] = [
  "disabled",
  "simple",
  "no-calories",
  "calories-macros",
  "advanced",
  "performance",
  "fat-loss-prudent",
  "muscle-gain"
];

const themeOptions: Array<{ id: AppTheme; label: string; description: string }> = [
  { id: "light", label: "Clair", description: "Fond crème, sobre et lisible." },
  { id: "dark", label: "Sombre", description: "Premium, moins lumineux le soir." },
  { id: "soft-blue", label: "Bleu léger", description: "Plus frais, doux et sportif." }
];

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [vacationWeeks, setVacationWeeks] = useState(settings.vacationWeeks.join(", "));
  const [status, setStatus] = useState("");
  const modulePrefs = resolveModulePreferences(form);
  const hyroxMode = isHyroxCompetitionMode(form);
  const showSportSettings = modulePrefs.enabledModules.includes("training") || modulePrefs.enabledModules.includes("sessions");
  const showNutritionSettings = modulePrefs.enabledModules.includes("nutrition");
  const showWeightSettings = !form.eatingDisorderHistory && (showNutritionSettings || modulePrefs.enabledModules.includes("weight"));
  const calculatedBmr = calculateBasalMetabolicRate({ ...form, useCalculatedBmr: true }, form.defaultBodyWeight);
  const displayedBmr = form.useCalculatedBmr ? calculatedBmr : form.dailyCalorieTarget;
  const primaryTabs = modulePrefs.primaryModuleTabs;
  const modulesInPlus = modulePrefs.enabledModules.filter((moduleId) => !primaryTabs.includes(moduleId));

  const update = (key: keyof Settings, value: string | number | boolean) => {
    setForm((current) => ({
      ...current,
      [key]:
        key === "targetDate" || key === "startDate" || key === "injuryNotes"
          ? value
          : key === "appMode"
            ? (value as AppExperienceMode)
            : key === "theme"
              ? (value as AppTheme)
              : key === "badmintonVariant"
                ? (value as BadmintonVariant)
                : key === "sex"
                  ? (value as BmrSex)
                  : key === "sportLevel"
                    ? (value as UserSportLevel)
                    : key === "nutritionMode"
                      ? (value as NutritionTrackingMode)
                      : key === "useCalculatedBmr"
                        ? Boolean(value)
                        : key === "privacyConsentAccepted" || key === "eatingDisorderHistory"
                          ? Boolean(value)
                          : Number(value)
    }));
  };

  const saveCurrentForm = (message = "Réglages enregistrés.") => {
    saveSettings({ ...form, vacationWeeks: parseVacationWeeks(vacationWeeks) });
    setStatus(message);
  };

  const persistForm = (nextForm: Settings, message: string) => {
    setForm(nextForm);
    saveSettings({ ...nextForm, vacationWeeks: parseVacationWeeks(vacationWeeks) });
    setStatus(message);
  };

  const updateModules = (next: Pick<Settings, "enabledModules" | "primaryModuleTabs">) => {
    const nutritionEnabled = next.enabledModules?.includes("nutrition") ?? false;
    const nextNutritionMode =
      !nutritionEnabled
        ? "disabled"
        : (form.nutritionMode ?? "calories-macros") === "disabled"
          ? "simple"
          : form.nutritionMode ?? "calories-macros";
    const guarded = applyNutritionModeToModules(nextNutritionMode, next.enabledModules ?? [], next.primaryModuleTabs ?? []);
    const safeEnabled = form.eatingDisorderHistory ? guarded.enabledModules.filter((moduleId) => moduleId !== "weight") : guarded.enabledModules;
    const safeTabs = form.eatingDisorderHistory ? guarded.primaryModuleTabs.filter((moduleId) => moduleId !== "weight") : guarded.primaryModuleTabs;
    const nextForm = {
      ...form,
      nutritionMode: nextNutritionMode,
      enabledModules: safeEnabled,
      primaryModuleTabs: safeTabs,
      navigationFocus: deriveNavigationFocusFromModules(safeEnabled)
    };

    persistForm(nextForm, "Modules mis à jour.");
  };

  const updateEatingDisorderHistory = (checked: boolean) => {
    const safeModules = checked ? modulePrefs.enabledModules.filter((moduleId) => moduleId !== "weight") : modulePrefs.enabledModules;
    const safeTabs = checked ? modulePrefs.primaryModuleTabs.filter((moduleId) => moduleId !== "weight") : modulePrefs.primaryModuleTabs;
    const nextNutritionMode = checked && ["calories-macros", "advanced", "performance", "fat-loss-prudent", "muscle-gain"].includes(form.nutritionMode ?? "")
      ? "no-calories"
      : form.nutritionMode ?? "calories-macros";
    const guarded = applyNutritionModeToModules(nextNutritionMode, safeModules, safeTabs);

    persistForm(
      {
        ...form,
        eatingDisorderHistory: checked,
        nutritionMode: nextNutritionMode,
        enabledModules: guarded.enabledModules,
        primaryModuleTabs: guarded.primaryModuleTabs,
        navigationFocus: deriveNavigationFocusFromModules(guarded.enabledModules)
      },
      checked ? "Mode prudent activé." : "Préférence santé mise à jour."
    );
  };

  const applyRecommendedModules = () => {
    const recommended = recommendedModulesByGoal[form.appMode ?? "competition"];
    const nextNutritionMode =
      recommended.enabled.includes("nutrition") && (form.nutritionMode ?? "calories-macros") === "disabled"
        ? "simple"
        : form.nutritionMode ?? "calories-macros";
    const guarded = applyNutritionModeToModules(nextNutritionMode, recommended.enabled, recommended.tabs);
    const safeEnabled = form.eatingDisorderHistory ? guarded.enabledModules.filter((moduleId) => moduleId !== "weight") : guarded.enabledModules;
    const safeTabs = form.eatingDisorderHistory ? guarded.primaryModuleTabs.filter((moduleId) => moduleId !== "weight") : guarded.primaryModuleTabs;
    const nextForm = {
      ...form,
      nutritionMode: nextNutritionMode,
      enabledModules: safeEnabled,
      primaryModuleTabs: safeTabs,
      navigationFocus: deriveNavigationFocusFromModules(safeEnabled)
    };

    persistForm(nextForm, "Configuration recommandée appliquée.");
  };

  return (
    <>
      <PageHeader title="Réglages" description="Modules, profil, nutrition, santé, apparence et sauvegarde locale." />

      {status ? (
        <div className="rounded-card border border-limeSoft/70 bg-limeSoft/35 p-3 text-sm font-black text-petrol-800">
          {status}
        </div>
      ) : null}

      <CollapsibleSectionCard
        id="modules"
        title="Modules visibles"
        className="scroll-mt-24"
        summary="Active uniquement ce que tu veux voir dans l'app."
      >
        <ModulePreferencesEditor
          enabledModules={modulePrefs.enabledModules}
          primaryModuleTabs={modulePrefs.primaryModuleTabs}
          onChange={updateModules}
        />
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        title="Onglets principaux"
        summary={`Menu mobile : ${primaryTabs.length}/${MAX_PRIMARY_TABS}. Les autres modules restent dans Plus.`}
      >
        <div className="grid gap-4">
          <div className="rounded-card border border-petrol-800/10 bg-mist/45 p-3">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">Menu actuel</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {primaryTabs.map((moduleId, index) => {
                const module = modulesConfig[moduleId];

                return (
                  <span key={`${moduleId}-${index}`} className="inline-flex min-h-11 items-center gap-2 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-petrol-800">
                    <module.icon className="h-4 w-4" aria-hidden="true" />
                    {index + 1}. {module.shortLabel}
                  </span>
                );
              })}
            </div>
          </div>

          {modulesInPlus.length ? (
            <div className="rounded-card border border-petrol-800/10 bg-white/70 p-3">
              <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">Dans Plus</p>
              <p className="mt-2 text-sm font-bold leading-6 text-ink">
                {modulesInPlus.map((moduleId) => modulesConfig[moduleId].label).join(", ")}
              </p>
            </div>
          ) : null}

          <button type="button" className="ghost-button justify-center sm:w-fit" onClick={applyRecommendedModules}>
            Appliquer la configuration recommandée
          </button>
        </div>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Profil sportif" summary="Objectif, disponibilité, durée et contraintes.">
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveCurrentForm("Profil sportif enregistré.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="field-label">
              Mode principal
              <select className="field" value={form.appMode ?? "competition"} onChange={(event) => update("appMode", event.target.value)}>
                {GENERAL_SPORT_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>

            {showSportSettings ? (
              <>
                <label className="field-label">
                  Date cible compétition
                  <input className="field" type="date" value={form.targetDate} onChange={(event) => update("targetDate", event.target.value)} />
                </label>
                <label className="field-label">
                  Début préparation
                  <input className="field" type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />
                </label>
                <label className="field-label">
                  Niveau sportif
                  <select className="field" value={form.sportLevel ?? "intermediate"} onChange={(event) => update("sportLevel", event.target.value)}>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Confirmé</option>
                  </select>
                </label>
                <label className="field-label">
                  Durée max par séance
                  <select className="field" value={form.maxSessionDurationMin ?? 75} onChange={(event) => update("maxSessionDurationMin", event.target.value)}>
                    {[30, 45, 60, 75, 90].map((duration) => (
                      <option key={duration} value={duration}>
                        {duration} min
                      </option>
                    ))}
                  </select>
                </label>
                {hyroxMode ? (
                  <div className="sm:col-span-2 xl:col-span-4">
                    <BadmintonVariantSelector
                      value={form.badmintonVariant}
                      onChange={(badmintonVariant) => setForm((previous) => ({ ...previous, badmintonVariant }))}
                    />
                  </div>
                ) : null}
                <div className="field-label sm:col-span-2 xl:col-span-4">
                  Jours disponibles
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {dayOptions.map((day) => {
                      const active = form.availableDays?.includes(day.id) ?? false;

                      return (
                        <button
                          key={day.id}
                          type="button"
                          className={`min-h-11 border text-sm font-black uppercase tracking-[0.05em] ${
                            active ? "border-petrol-800 bg-limeSoft text-petrol-900" : "border-petrol-800/10 bg-white text-muted"
                          }`}
                          onClick={() => {
                            const current = form.availableDays ?? [];
                            const availableDays = active ? current.filter((item) => item !== day.id) : [...current, day.id];
                            setForm((previous) => ({ ...previous, availableDays }));
                          }}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="field-label sm:col-span-2">
                  Douleurs / limitations
                  <input className="field" value={form.injuryNotes ?? ""} onChange={(event) => update("injuryNotes", event.target.value)} placeholder="Ex : mollet, genou, épaule..." />
                </label>
                <label className="field-label sm:col-span-2">
                  Semaines vacances
                  <input
                    className="field"
                    value={vacationWeeks}
                    onChange={(event) => setVacationWeeks(event.target.value)}
                    placeholder="Ex : 9, 18, 27"
                  />
                </label>
              </>
            ) : null}
          </div>

          <button className="action-button sm:w-fit" type="submit">
            <Save className="h-4 w-4" /> Enregistrer le profil
          </button>
        </form>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Nutrition" summary="Mode de suivi, protéines, poids et calculs énergie.">
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveCurrentForm("Nutrition enregistrée.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="field-label sm:col-span-2">
              Mode nutrition
              <select
                className="field"
                value={form.nutritionMode ?? "calories-macros"}
                onChange={(event) => {
                  const mode = event.target.value as NutritionTrackingMode;
                  const guarded = applyNutritionModeToModules(mode, modulePrefs.enabledModules, modulePrefs.primaryModuleTabs);
                  persistForm(
                    {
                      ...form,
                      nutritionMode: mode,
                      enabledModules: guarded.enabledModules,
                      primaryModuleTabs: guarded.primaryModuleTabs,
                      navigationFocus: deriveNavigationFocusFromModules(guarded.enabledModules)
                    },
                    mode === "disabled" ? "Nutrition désactivée." : "Mode nutrition mis à jour."
                  );
                }}
              >
                {nutritionModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {getNutritionModeLabel(mode)}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold normal-case tracking-normal text-muted">
                {getNutritionModeGuidance(form.nutritionMode ?? "calories-macros")}
              </span>
            </label>

            {showWeightSettings ? (
              <>
                <label className="field-label">
                  Poids de départ
                  <input className="field" type="number" step="0.1" value={form.startWeight} onChange={(event) => update("startWeight", event.target.value)} />
                </label>
                <label className="field-label">
                  Poids actuel par défaut
                  <input className="field" type="number" step="0.1" value={form.defaultBodyWeight} onChange={(event) => update("defaultBodyWeight", event.target.value)} />
                </label>
                <label className="field-label">
                  Objectif perte de poids
                  <input className="field" type="number" step="0.1" value={form.targetWeightLoss} onChange={(event) => update("targetWeightLoss", event.target.value)} />
                </label>
                <label className="field-label">
                  Protéines g/kg
                  <input className="field" type="number" step="0.1" value={form.proteinPerKg} onChange={(event) => update("proteinPerKg", event.target.value)} />
                </label>
                <label className="field-label">
                  Taille
                  <input className="field" type="number" value={form.heightCm} onChange={(event) => update("heightCm", event.target.value)} />
                </label>
                <label className="field-label">
                  Âge
                  <input className="field" type="number" value={form.age} onChange={(event) => update("age", event.target.value)} />
                </label>
                <label className="field-label">
                  Sexe pour le calcul
                  <select className="field" value={form.sex} onChange={(event) => update("sex", event.target.value)}>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </label>
                <label className="field-label">
                  Calcul auto métabolisme
                  <select
                    className="field"
                    value={form.useCalculatedBmr ? "yes" : "no"}
                    onChange={(event) => update("useCalculatedBmr", event.target.value === "yes")}
                  >
                    <option value="yes">Oui</option>
                    <option value="no">Valeur manuelle</option>
                  </select>
                </label>
                <label className="field-label">
                  Métabolisme utilisé
                  <input
                    className={`field ${form.useCalculatedBmr ? "bg-mist/60" : ""}`}
                    type="number"
                    value={displayedBmr}
                    readOnly={form.useCalculatedBmr}
                    onChange={(event) => {
                      if (!form.useCalculatedBmr) update("dailyCalorieTarget", event.target.value);
                    }}
                  />
                </label>
                <label className="field-label">
                  Déficit cible kcal/jour
                  <input className="field" type="number" value={form.targetDailyDeficit} onChange={(event) => update("targetDailyDeficit", event.target.value)} />
                </label>
              </>
            ) : (
              <div className="rounded-card border border-petrol-800/10 bg-mist/45 p-4 text-sm font-bold leading-6 text-muted sm:col-span-2 xl:col-span-4">
                Le suivi poids/calories avancé est masqué. Tu peux garder une nutrition simple centrée sur repas, hydratation et sensations.
              </div>
            )}
          </div>

          <button className="action-button sm:w-fit" type="submit">
            <Save className="h-4 w-4" /> Enregistrer la nutrition
          </button>
        </form>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Récupération / santé" summary="Consentement local et garde-fous santé.">
        <div className="grid gap-4">
          <label className="flex items-start gap-3 text-sm font-bold leading-6 text-ink">
            <input
              className="mt-1"
              type="checkbox"
              checked={Boolean(form.privacyConsentAccepted)}
              onChange={(event) => {
                const accepted = event.target.checked;
                persistForm(
                  {
                    ...form,
                    privacyConsentAccepted: accepted,
                    privacyConsentAt: accepted ? new Date().toISOString() : undefined
                  },
                  accepted ? "Consentement enregistré." : "Consentement retiré."
                );
              }}
            />
            <span>J'accepte le stockage local des données sport, santé, nutrition et poids.</span>
          </label>

          <label className="flex items-start gap-3 rounded-card border border-petrol-800/10 bg-mist/45 p-3 text-sm font-bold leading-6 text-ink">
            <input
              className="mt-1"
              type="checkbox"
              checked={Boolean(form.eatingDisorderHistory)}
              onChange={(event) => updateEatingDisorderHistory(event.target.checked)}
            />
            <span>Suivi sensible / TCA : masquer calories avancées et poids par défaut.</span>
          </label>

          {form.privacyConsentAt ? (
            <p className="text-xs font-bold text-muted">Dernière validation : {new Date(form.privacyConsentAt).toLocaleString("fr-FR")}</p>
          ) : null}

          <details className="rounded-card border border-petrol-800/10 bg-white/70 p-3">
            <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-[0.06em] text-petrol-800">
              Messages de prudence
            </summary>
            <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted">
              <p>Douleur persistante ou technique modifiée : évite l'intensité et demande un avis professionnel si ça persiste.</p>
              <p>Perte rapide + fatigue + sommeil mauvais : augmente l'apport ou réduis la charge.</p>
              <p>Grossesse, pathologie, traitement, mineur ou antécédents TCA : demande un avis médical avant les objectifs nutrition/poids.</p>
            </div>
          </details>
        </div>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        id="install"
        title="Apparence"
        className="scroll-mt-24"
        summary="Thème de l'application et installation PWA."
      >
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const selected = (form.theme ?? "light") === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`rounded-card border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${
                    selected
                      ? "border-[#00354A] bg-[#00354A] text-white"
                      : "border-petrol-800/10 bg-white/70 text-ink"
                  }`}
                  onClick={() => persistForm({ ...form, theme: option.id }, `Thème ${option.label.toLowerCase()} appliqué.`)}
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${selected ? "bg-white/15" : "bg-mist"}`}>
                    <Palette className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block font-display text-xl font-black tracking-[-0.05em]">{option.label}</span>
                  <span className={`mt-1 block text-sm font-bold leading-5 ${selected ? "text-white/70" : "text-muted"}`}>
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-petrol-800/10 bg-mist/45 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold leading-6 text-muted">Installer l'app sur l'écran d'accueil.</p>
            <PwaInstallButton />
          </div>
        </div>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        id="data"
        title="Données locales"
        className="scroll-mt-24"
        summary="Exporter, fusionner, remplacer ou réinitialiser."
      >
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold leading-6 text-muted">
              Tout reste dans ce navigateur. Pour synchroniser téléphone et PC, exporte un JSON puis fusionne-le sur l'autre appareil.
            </p>
            <pre className="mt-4 max-h-56 overflow-auto rounded-card bg-petrol-900 p-4 text-xs font-bold text-limeSoft">{getExportPreview()}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="action-button" onClick={exportJson}>
                <Download className="h-4 w-4" /> Export JSON
              </button>
              <label className="action-button cursor-pointer bg-limeSoft text-petrol-900 hover:bg-white">
                <Upload className="h-4 w-4" /> Fusionner JSON
                <input
                  className="hidden"
                  type="file"
                  accept="application/json"
                  multiple
                  onChange={async (event) => {
                    const files = event.target.files;
                    if (!files?.length) return;
                    const summary = await mergeJsonFiles(files);
                    setStatus(
                      `Fusion terminée : ${summary.files} fichier(s), ${summary.sessions} séances, ${summary.meals} repas, ${summary.weights} poids.`
                    );
                    event.target.value = "";
                  }}
                />
              </label>
              <label className="ghost-button cursor-pointer">
                <Upload className="h-4 w-4" /> Remplacer JSON
                <input
                  className="hidden"
                  type="file"
                  accept="application/json"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    await importJsonFile(file);
                    setStatus("Import terminé : données remplacées.");
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <div className="rounded-card border border-red-950/10 bg-red-50 p-4">
            <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-red-950">Reset données</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-red-950/70">
              Efface séances, repas, poids et réglages. Action à confirmer.
            </p>
            <button
              className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-red-950/25 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-red-950"
              onClick={() => {
                if (window.confirm("Réinitialiser toutes les données locales ?")) {
                  const data = resetData();
                  setForm(data.settings);
                  setVacationWeeks(data.settings.vacationWeeks.join(", "));
                  setStatus("Données réinitialisées.");
                }
              }}
            >
              <RefreshCcw className="h-4 w-4" /> Reset avec confirmation
            </button>
          </div>
        </div>
      </CollapsibleSectionCard>
    </>
  );
}
