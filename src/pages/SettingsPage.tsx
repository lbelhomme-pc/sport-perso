import { useState } from "react";
import { Download, RefreshCcw, Save, Upload } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { PwaInstallButton } from "../components/ui/PwaInstallButton";
import { ModulePreferencesEditor } from "../components/modules/ModulePreferencesEditor";
import { BadmintonVariantSelector } from "../components/planning/BadmintonVariantSelector";
import { GENERAL_SPORT_MODES } from "../data/defaults";
import { deriveNavigationFocusFromModules, recommendedModulesByGoal, resolveModulePreferences } from "../data/modules";
import { exportJson, getExportPreview, importJsonFile, mergeJsonFiles } from "../services/exportService";
import { resetData } from "../services/storageService";
import { useSettings } from "../hooks/useSettings";
import type { AppExperienceMode, BadmintonVariant, BmrSex, NutritionTrackingMode, Settings, UserSportLevel, WeekdayKey } from "../types";
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

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [vacationWeeks, setVacationWeeks] = useState(settings.vacationWeeks.join(", "));
  const hyroxMode = isHyroxCompetitionMode(form);
  const [status, setStatus] = useState("");
  const modulePrefs = resolveModulePreferences(form);
  const showSportSettings = modulePrefs.enabledModules.includes("training") || modulePrefs.enabledModules.includes("sessions");
  const showNutritionSettings = modulePrefs.enabledModules.includes("nutrition");
  const showWeightSettings = !form.eatingDisorderHistory && (showNutritionSettings || modulePrefs.enabledModules.includes("weight"));
  const calculatedBmr = calculateBasalMetabolicRate({ ...form, useCalculatedBmr: true }, form.defaultBodyWeight);
  const displayedBmr = form.useCalculatedBmr ? calculatedBmr : form.dailyCalorieTarget;

  const update = (key: keyof Settings, value: string | number | boolean) => {
    setForm((current) => ({
      ...current,
      [key]:
        key === "targetDate" || key === "startDate" || key === "injuryNotes"
          ? value
          : key === "appMode"
            ? (value as AppExperienceMode)
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

  const persistForm = (nextForm: Settings, message: string) => {
    setForm(nextForm);
    saveSettings({ ...nextForm, vacationWeeks: parseVacationWeeks(vacationWeeks) });
    setStatus(message);
  };

  const updateModules = (next: Pick<Settings, "enabledModules" | "primaryModuleTabs">) => {
    const nextNutritionMode =
      next.enabledModules?.includes("nutrition") && (form.nutritionMode ?? "calories-macros") === "disabled"
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

    persistForm(nextForm, "Navigation mise à jour automatiquement.");
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
      checked
        ? "Mode prudent activé : calories avancées et poids sont masqués par défaut."
        : "Préférence santé mise à jour."
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
      <PageHeader
        eyebrow="Profil"
        title="Objectifs et préférences"
        description="La V1 reste sans backend. Tout est stocké dans ce navigateur, avec export/import JSON pour sauvegarder ou migrer."
      />

      <CollapsibleSectionCard
        eyebrow="Objectifs"
        title="Profil et préférences"
        summary={
          showSportSettings && showNutritionSettings
            ? "Mode principal, dates, poids, métabolisme de base, déficit et modules."
            : showSportSettings
              ? "Mode principal, calendrier, programme et modules."
              : "Mode principal, nutrition, poids, métabolisme de base et déficit."
        }
        defaultOpen
      >
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveSettings({ ...form, vacationWeeks: parseVacationWeeks(vacationWeeks) });
            setStatus("Réglages enregistrés.");
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
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Phase 1 : ce choix personnalise l'expérience sans supprimer les modes spécialisés.
              </span>
            </label>
            <div className="grid gap-3 sm:col-span-2 xl:col-span-4">
              <ModulePreferencesEditor
                enabledModules={modulePrefs.enabledModules}
                primaryModuleTabs={modulePrefs.primaryModuleTabs}
                onChange={updateModules}
              />
              <p className="text-xs font-bold leading-5 text-muted">
                Les onglets changent maintenant tout de suite : pas besoin d'appuyer sur Enregistrer pour la navigation.
              </p>
              <button type="button" className="ghost-button justify-center sm:w-fit" onClick={applyRecommendedModules}>
                Appliquer la configuration recommandée pour ce mode
              </button>
            </div>
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
                    mode === "disabled" ? "Nutrition désactivée et retirée des menus." : "Mode nutrition mis à jour."
                  );
                }}
              >
                {nutritionModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {getNutritionModeLabel(mode)}
                  </option>
                ))}
              </select>
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                {getNutritionModeGuidance(form.nutritionMode ?? "calories-macros")}
              </span>
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
            {hyroxMode ? (
              <div className="sm:col-span-2">
                <BadmintonVariantSelector
                  value={form.badmintonVariant}
                  onChange={(badmintonVariant) => setForm((previous) => ({ ...previous, badmintonVariant }))}
                />
                <p className="mt-2 text-xs font-bold leading-5 text-muted">
                  Tu choisis le volume réaliste de badminton. Le planning propose ensuite les séances de la semaine, mais l'accueil reste flexible jour par jour.
                </p>
              </div>
            ) : null}
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
            <div className="field-label sm:col-span-2">
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
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Le planning transforme les séances des jours indisponibles en repos/mobilité.
              </span>
            </div>
            <label className="field-label sm:col-span-2">
              Douleurs / limitations
              <input className="field" value={form.injuryNotes ?? ""} onChange={(event) => update("injuryNotes", event.target.value)} placeholder="Ex : mollet, genou, épaule..." />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Ajouté aux consignes de séance et utilisé pour baisser l'agressivité.
              </span>
            </label>
            </>
            ) : null}
            {showWeightSettings ? (
            <>
            <label className="field-label">
              Poids de départ
              <input className="field" type="number" step="0.1" value={form.startWeight} onChange={(event) => update("startWeight", event.target.value)} />
            </label>
            <label className="field-label">
              Poids actuel par défaut
              <input className="field" type="number" step="0.1" value={form.defaultBodyWeight} onChange={(event) => update("defaultBodyWeight", event.target.value)} />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Utilisé pour le calcul du métabolisme de base si aucune pesée récente n'est saisie.
              </span>
            </label>
            <label className="field-label">
              Objectif perte de poids
              <input className="field" type="number" step="0.1" value={form.targetWeightLoss} onChange={(event) => update("targetWeightLoss", event.target.value)} />
            </label>
            <label className="field-label">
              Protéines g/kg
              <input className="field" type="number" step="0.1" value={form.proteinPerKg} onChange={(event) => update("proteinPerKg", event.target.value)} />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                1,9 g/kg convient souvent à un sportif, mais ce n'est pas universel. Ajuste selon objectif, faim, santé et avis pro si besoin.
              </span>
            </label>
            <label className="field-label">
              Taille
              <input className="field" type="number" value={form.heightCm} onChange={(event) => update("heightCm", event.target.value)} />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">En centimètres.</span>
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
              Calcul automatique du métabolisme
              <select
                className="field"
                value={form.useCalculatedBmr ? "yes" : "no"}
                onChange={(event) => update("useCalculatedBmr", event.target.value === "yes")}
              >
                <option value="yes">Oui, avec taille / poids / âge</option>
                <option value="no">Non, valeur manuelle</option>
              </select>
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Formule Mifflin-St Jeor avec {form.defaultBodyWeight} kg, {form.heightCm} cm et {form.age} ans.
              </span>
            </label>
            <label className="field-label">
              Métabolisme de base utilisé
              <input
                className={`field ${form.useCalculatedBmr ? "bg-mist/60" : ""}`}
                type="number"
                value={displayedBmr}
                readOnly={form.useCalculatedBmr}
                onChange={(event) => {
                  if (!form.useCalculatedBmr) update("dailyCalorieTarget", event.target.value);
                }}
              />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                {form.useCalculatedBmr
                  ? "Calculé automatiquement. Désactive le calcul auto pour saisir une valeur manuelle."
                  : "Valeur manuelle utilisée comme métabolisme basal."}
              </span>
            </label>
            <label className="field-label">
              Déficit cible kcal/jour
              <input className="field" type="number" value={form.targetDailyDeficit} onChange={(event) => update("targetDailyDeficit", event.target.value)} />
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                La cible alimentaire part de la maintenance estimée, jamais du métabolisme de base moins déficit. 400 kcal reste une valeur prudente à ajuster avec fatigue/faim/sommeil.
              </span>
            </label>
            </>
            ) : null}
            {showSportSettings ? (
            <label className="field-label">
              Semaines vacances
              <input
                className="field"
                value={vacationWeeks}
                onChange={(event) => setVacationWeeks(event.target.value)}
                placeholder="Ex : 9, 18, 27"
              />
            </label>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="action-button" type="submit">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
            {status ? <span className="text-sm font-black text-petrol-800">{status}</span> : null}
          </div>
        </form>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        eyebrow="Confidentialité"
        title="Données locales santé / sport"
        summary={form.privacyConsentAccepted ? "Consentement enregistré pour le stockage local." : "Consentement à valider avant un suivi complet."}
      >
        <div className="grid gap-4">
          <p className="text-sm font-semibold leading-6 text-muted">
            L'application stocke localement dans ce navigateur des données de sport, récupération, nutrition et poids. Il n'y a pas de backend en V1.
            Tu peux exporter, importer, fusionner ou réinitialiser ces données depuis cette page.
          </p>
          <label className="flex items-start gap-3 text-sm font-bold leading-6 text-ink">
            <input
              className="mt-1"
              type="checkbox"
              checked={Boolean(form.privacyConsentAccepted)}
              onChange={(event) => {
                const accepted = event.target.checked;
                const nextForm = {
                  ...form,
                  privacyConsentAccepted: accepted,
                  privacyConsentAt: accepted ? new Date().toISOString() : undefined
                };
                persistForm(nextForm, accepted ? "Consentement confidentialité enregistré." : "Consentement retiré.");
              }}
            />
            <span>J'accepte ce stockage local et je comprends que je reste responsable de mes exports/sauvegardes.</span>
          </label>
          {form.privacyConsentAt ? <p className="text-xs font-bold text-muted">Dernière validation : {new Date(form.privacyConsentAt).toLocaleString("fr-FR")}</p> : null}
          <label className="flex items-start gap-3 border border-petrol-800/10 bg-mist/45 p-3 text-sm font-bold leading-6 text-ink">
            <input
              className="mt-1"
              type="checkbox"
              checked={Boolean(form.eatingDisorderHistory)}
              onChange={(event) => updateEatingDisorderHistory(event.target.checked)}
            />
            <span>
              Antécédents de troubles alimentaires ou suivi sensible : masquer par défaut les calories avancées et le poids. Tu peux garder un journal simple
              basé sur repas, protéines, hydratation et sensations.
            </span>
          </label>
          <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-semibold leading-6 text-ink">
            Grossesse, pathologie, traitement, mineur, antécédents TCA : demande un avis médical avant d'utiliser les objectifs nutrition/poids.
            Douleur persistante ou technique modifiée : demande un avis professionnel avant les séances intenses.
          </div>
        </div>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        eyebrow="Application"
        title="Installer la PWA"
        summary="Optionnel : utile sur téléphone, mais rangé ici pour garder l'accueil concentré sur l'action."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-muted">
            Installe l'app sur ton écran d'accueil si tu veux l'ouvrir comme une application classique.
          </p>
          <PwaInstallButton />
        </div>
      </CollapsibleSectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <CollapsibleSectionCard
          eyebrow="Export / Import JSON"
          title="Sauvegarde locale"
          summary="Exporter, fusionner ou remplacer tes données locales."
        >
          <p className="mt-3 text-sm font-semibold leading-6 text-muted">
            Pour passer du téléphone au PC : exporte le JSON sur un appareil, puis utilise "Fusionner JSON" sur l'autre.
            L'app garde les entrées les plus récentes quand deux sauvegardes se croisent.
          </p>
          <pre className="mt-5 max-h-64 overflow-auto bg-petrol-900 p-4 text-xs font-bold text-limeSoft">{getExportPreview()}</pre>
          <div className="mt-5 flex flex-wrap gap-2">
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
                  setStatus("Import terminé : les données du navigateur ont été remplacées.");
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </CollapsibleSectionCard>

        <CollapsibleSectionCard
          dark
          eyebrow="Zone sensible"
          title="Reset données"
          summary="Action destructive avec confirmation."
        >
          <p className="mt-4 text-sm font-semibold leading-6 text-white/70">
            Efface séances, repas, poids et réglages pour revenir aux valeurs par défaut. À utiliser seulement si tu veux repartir propre.
          </p>
          <button
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white"
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
        </CollapsibleSectionCard>
      </div>
    </>
  );
}
