import { useState } from "react";
import { Download, RefreshCcw, Save, Upload } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { BADMINTON_VARIANTS, GENERAL_SPORT_MODES } from "../data/defaults";
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

  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Objectifs et préférences"
        description="La V1 reste sans backend. Tout est stocké dans ce navigateur, avec export/import JSON pour sauvegarder ou migrer."
      />

      <SectionCard className="p-5 sm:p-6">
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
            <label className="field-label">
              Semaines vacances
              <input
                className="field"
                value={vacationWeeks}
                onChange={(event) => setVacationWeeks(event.target.value)}
                placeholder="Ex : 9, 18, 27"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="action-button" type="submit">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
            {status ? <span className="text-sm font-black text-petrol-800">{status}</span> : null}
          </div>
        </form>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Export / Import JSON</p>
          <h2 className="title-lg mt-2">Sauvegarde locale</h2>
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
        </SectionCard>

        <SectionCard dark className="p-5 sm:p-6">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Zone sensible</p>
          <h2 className="mt-2 font-display text-4xl font-black tracking-[-0.07em]">Reset données</h2>
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
        </SectionCard>
      </div>
    </>
  );
}
