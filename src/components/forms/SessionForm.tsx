import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import { SESSION_TYPE_LABELS } from "../../data/defaults";
import { useSessionExerciseLogs } from "../../hooks/useSessionExerciseLogs";
import type { CompletedSession, CompletedSessionType, EnergyLevel, PlannedSession, SessionDifficulty } from "../../types";
import { estimateCaloriesFromSession } from "../../utils/calories";
import { toISODate } from "../../utils/dates";
import { buildCompletedExercises, mergeSessionNotesWithPlannedExercises } from "../../utils/sessionExercises";
import { makeId } from "../../services/storageService";
import { energyFromFatigueScore, hasMeaningfulPain } from "../../utils/readiness";
import { detailsToFormValues, getSessionDetailConfig, normalizeSessionDetails } from "../../utils/sessionDetails";

type SessionFormProps = {
  initial?: Partial<CompletedSession>;
  planned?: PlannedSession;
  typeOptions?: CompletedSessionType[];
  getTypeLabel?: (type: CompletedSessionType) => string;
  onSubmit: (session: CompletedSession) => void;
  onCancel?: () => void;
};

function mapPlannedType(type: PlannedSession["type"]): CompletedSession["type"] {
  if (type === "rest") return "recovery";
  return type;
}

export function SessionForm({ initial, planned, typeOptions, getTypeLabel, onSubmit, onCancel }: SessionFormProps) {
  const plannedType = planned ? mapPlannedType(planned.type) : undefined;
  const availableTypeOptions = typeOptions?.length ? typeOptions : (Object.keys(SESSION_TYPE_LABELS) as CompletedSessionType[]);
  const typeLabel = getTypeLabel ?? ((type: CompletedSessionType) => SESSION_TYPE_LABELS[type]);
  const { sessionExerciseLogs } = useSessionExerciseLogs(planned?.id);
  const [form, setForm] = useState<{
    id: string;
    plannedSessionId: string;
    date: string;
    type: CompletedSession["type"];
    title: string;
    durationMin: string;
    averageHeartRate: string;
    maxHeartRate: string;
    caloriesBurned: string;
    rpe: string;
    difficulty: SessionDifficulty;
    pain: boolean;
    painDuring: string;
    fatigueDuring: string;
    energyAfter: EnergyLevel;
    sessionDetails: Record<string, string>;
    notes: string;
    completed: boolean;
  }>({
    id: initial?.id ?? makeId("session"),
    plannedSessionId: initial?.plannedSessionId ?? planned?.id ?? "",
    date: initial?.date ?? planned?.date ?? toISODate(new Date()),
    type: initial?.type ?? plannedType ?? availableTypeOptions[0] ?? "strength",
    title: initial?.title ?? planned?.title ?? "",
    durationMin: String(initial?.durationMin ?? planned?.durationMin ?? 60),
    averageHeartRate: String(initial?.averageHeartRate ?? ""),
    maxHeartRate: String(initial?.maxHeartRate ?? ""),
    caloriesBurned: String(initial?.caloriesBurned ?? ""),
    rpe: String(initial?.rpe ?? ""),
    difficulty: initial?.difficulty ?? "ok",
    pain: initial?.pain ?? false,
    painDuring: String(initial?.painDuring ?? ""),
    fatigueDuring: String(initial?.fatigueDuring ?? ""),
    energyAfter: initial?.energyAfter ?? "normal",
    sessionDetails: detailsToFormValues(initial?.sessionDetails),
    notes: initial?.notes ?? "",
    completed: initial?.completed ?? true
  });

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateDetail = (key: string, value: string) => {
    setForm((current) => ({ ...current, sessionDetails: { ...current.sessionDetails, [key]: value } }));
  };

  const detailConfig = getSessionDetailConfig(form.type);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const durationMin = Number(form.durationMin || 0);
    const calories = form.caloriesBurned
      ? Number(form.caloriesBurned)
      : estimateCaloriesFromSession(form.type, durationMin);
    const painDuring = form.painDuring ? Number(form.painDuring) : undefined;
    const fatigueDuring = form.fatigueDuring ? Number(form.fatigueDuring) : undefined;

    onSubmit({
      id: form.id,
      plannedSessionId: form.plannedSessionId || undefined,
      date: form.date,
      type: form.type,
      title: form.title || typeLabel(form.type),
      durationMin,
      averageHeartRate: form.averageHeartRate ? Number(form.averageHeartRate) : undefined,
      maxHeartRate: form.maxHeartRate ? Number(form.maxHeartRate) : undefined,
      caloriesBurned: calories,
      rpe: form.rpe ? Number(form.rpe) : undefined,
      difficulty: form.difficulty,
      pain: hasMeaningfulPain(painDuring, form.pain),
      painDuring,
      fatigueDuring,
      energyAfter: fatigueDuring !== undefined ? energyFromFatigueScore(fatigueDuring) : form.energyAfter,
      sessionDetails: normalizeSessionDetails(form.type, form.sessionDetails),
      notes: mergeSessionNotesWithPlannedExercises(form.notes, planned),
      completed: form.completed,
      exercises: buildCompletedExercises(planned, form.completed, sessionExerciseLogs) ?? initial?.exercises
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft">
      {planned ? (
        <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
          Saisis les données réelles de la séance : durée, FC moyenne/max, calories et RPE. Elles alimentent l'accueil et les statistiques.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="field-label">
          Date
          <input className="field" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label className="field-label">
          Type
          <select className="field" value={form.type} onChange={(event) => update("type", event.target.value as CompletedSession["type"])}>
            {availableTypeOptions.map((value) => (
              <option key={value} value={value}>
                {typeLabel(value)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        Titre
        <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Ex : Force bas du corps, footing, badminton, mobilité..." />
      </label>

      <div className="grid gap-3 sm:grid-cols-5">
        <label className="field-label sm:col-span-1">
          Durée réelle
          <input className="field" type="number" min="0" value={form.durationMin} onChange={(event) => update("durationMin", event.target.value)} />
        </label>
        <label className="field-label sm:col-span-1">
          FC moy.
          <input className="field" type="number" min="0" value={form.averageHeartRate} onChange={(event) => update("averageHeartRate", event.target.value)} />
        </label>
        <label className="field-label sm:col-span-1">
          FC max
          <input className="field" type="number" min="0" value={form.maxHeartRate} onChange={(event) => update("maxHeartRate", event.target.value)} />
        </label>
        <label className="field-label sm:col-span-1">
          Calories sport
          <input className="field" type="number" min="0" value={form.caloriesBurned} onChange={(event) => update("caloriesBurned", event.target.value)} />
        </label>
        <label className="field-label sm:col-span-1">
          RPE / ressenti
          <input className="field" type="number" min="0" max="10" value={form.rpe} onChange={(event) => update("rpe", event.target.value)} />
        </label>
      </div>

      <div className="grid gap-3 border border-petrol-800/10 bg-mist/45 p-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-petrol-800">{detailConfig.title}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-muted">{detailConfig.hint}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {detailConfig.fields.map((field) => (
            <label key={field.key} className="field-label">
              {field.label}
              {field.unit ? <span className="normal-case tracking-normal text-muted"> ({field.unit})</span> : null}
              {field.type === "select" ? (
                <select className="field" value={form.sessionDetails[field.key] ?? ""} onChange={(event) => updateDetail(field.key, event.target.value)}>
                  <option value="">Non renseigne</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field"
                  type={field.type === "number" ? "number" : "text"}
                  inputMode={field.type === "number" ? "decimal" : undefined}
                  min={field.type === "number" ? "0" : undefined}
                  step={field.type === "number" ? "0.1" : undefined}
                  value={form.sessionDetails[field.key] ?? ""}
                  onChange={(event) => updateDetail(field.key, event.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <label className="field-label">
          Difficulté
          <select className="field" value={form.difficulty} onChange={(event) => update("difficulty", event.target.value as SessionDifficulty)}>
            <option value="easy">Facile</option>
            <option value="ok">Soutenue mais OK</option>
            <option value="hard">Très dure</option>
          </select>
        </label>
        <label className="field-label">
          Fatigue pendant / 10
          <input className="field" type="number" min="0" max="10" inputMode="numeric" value={form.fatigueDuring} onChange={(event) => update("fatigueDuring", event.target.value)} placeholder="0-10" />
        </label>
        <label className="field-label">
          Douleur pendant / 10
          <input className="field" type="number" min="0" max="10" inputMode="numeric" value={form.painDuring} onChange={(event) => update("painDuring", event.target.value)} placeholder="0-10" />
        </label>
        <label className="field-label">
          Énergie après
          <select className="field" value={form.energyAfter} onChange={(event) => update("energyAfter", event.target.value as EnergyLevel)}>
            <option value="strong">Bonne</option>
            <option value="normal">Normale</option>
            <option value="fatigue">Basse</option>
          </select>
        </label>
      </div>

      <label className="field-label">
        Commentaire rapide
        <textarea className="textarea-field" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ce qui a marché, douleur, charge trop lourde, jambes lourdes, adaptation..." />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
          <input type="checkbox" checked={form.completed} onChange={(event) => update("completed", event.target.checked)} />
          Séance réalisée
        </label>
        <div className="flex gap-2">
          {onCancel ? (
            <button type="button" className="ghost-button" onClick={onCancel}>
              <X className="h-4 w-4" /> Annuler
            </button>
          ) : null}
          <button type="submit" className="action-button">
            <Save className="h-4 w-4" /> {planned ? "Valider séance" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}
