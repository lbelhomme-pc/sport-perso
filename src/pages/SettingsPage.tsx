import { useState } from "react";
import { Download, RefreshCcw, Save, Upload } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { PwaInstallButton } from "../components/ui/PwaInstallButton";
import { ModulePreferencesEditor } from "../components/modules/ModulePreferencesEditor";
import { BADMINTON_VARIANTS, GENERAL_SPORT_MODES } from "../data/defaults";
import { deriveNavigationFocusFromModules, recommendedModulesByGoal, resolveModulePreferences } from "../data/modules";
import { exportJson, getExportPreview, importJsonFile, mergeJsonFiles } from "../services/exportService";
import { resetData } from "../services/storageService";
import { useSettings } from "../hooks/useSettings";
import type { AppExperienceMode, BadmintonVariant, BmrSex, Settings } from "../types";
import { calculateBasalMetabolicRate } from "../utils/calories";

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

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [vacationWeeks, setVacationWeeks] = useState(settings.vacationWeeks.join(", "));
  const [status, setStatus] = useState("");
  const modulePrefs = resolveModulePreferences(form);
  const showSportSettings = modulePrefs.enabledModules.includes("training") || modulePrefs.enabledModules.includes("sessions");
  const showNutritionSettings = modulePrefs.enabledModules.includes("nutrition");
  const showWeightSettings = showNutritionSettings || modulePrefs.enabledModules.includes("weight");
  const calculatedBmr = calculateBasalMetabolicRate({ ...form, useCalculatedBmr: true }, form.defaultBodyWeight);
  const displayedBmr = form.useCalculatedBmr ? calculatedBmr : form.dailyCalorieTarget;

  const update = (key: keyof Settings, value: string | number | boolean) => {
    setForm((current) => ({
      ...current,
      [key]:
        key === "targetDate" || key === "startDate"
          ? value
          : key === "appMode"
            ? (value as AppExperienceMode)
          : key === "badmintonVariant"
            ? (value as BadmintonVariant)
          : key === "sex"
            ? (value as BmrSex)
            : key === "useCalculatedBmr"
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
    const nextForm = {
      ...form,
      enabledModules: next.enabledModules,
      primaryModuleTabs: next.primaryModuleTabs,
      navigationFocus: deriveNavigationFocusFromModules(next.enabledModules ?? [])
    };

    persistForm(nextForm, "Navigation mise à jour automatiquement.");
  };

  const applyRecommendedModules = () => {
    const recommended = recommendedModulesByGoal[form.appMode ?? "competition"];
    const nextForm = {
      ...form,
      enabledModules: recommended.enabled,
      primaryModuleTabs: recommended.tabs,
      navigationFocus: deriveNavigationFocusFromModules(recommended.enabled)
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
            ? "Mode principal, dates, poids, BMR, déficit et configuration compétition."
            : showSportSettings
              ? "Mode principal, calendrier, programme et configuration compétition."
              : "Mode principal, nutrition, poids, BMR et déficit."
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
                Phase 1 : ce choix prépare la personnalisation générale sans supprimer le programme HYROX.
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
            <label className="field-label sm:col-span-2">
              Configuration badminton du programme HYROX
              <select className="field" value={form.badmintonVariant} onChange={(event) => update("badmintonVariant", event.target.value)}>
                {BADMINTON_VARIANTS.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.label}
                  </option>
                ))}
              </select>
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                Les 10 combinaisons sont conservées dans le mode compétition HYROX.
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
                Utilisé pour le calcul BMR si aucune pesée récente n'est saisie.
              </span>
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
              <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">En centimètres.</span>
            </label>
            <label className="field-label">
              Âge
              <input className="field" type="number" value={form.age} onChange={(event) => update("age", event.target.value)} />
            </label>
            <label className="field-label">
              Sexe formule BMR
              <select className="field" value={form.sex} onChange={(event) => update("sex", event.target.value)}>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </label>
            <label className="field-label">
              Calcul BMR automatique
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
              Métabolisme basal utilisé
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
                400 kcal = perte progressive, moins agressive pour l'entraînement.
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
