import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import { SESSION_TYPE_LABELS } from "../../data/defaults";
import { useSessionExerciseLogs } from "../../hooks/useSessionExerciseLogs";
import type { CompletedSession, PlannedSession } from "../../types";
import { estimateCaloriesFromSession } from "../../utils/calories";
import { toISODate } from "../../utils/dates";
import { buildCompletedExercises, mergeSessionNotesWithPlannedExercises } from "../../utils/sessionExercises";
import { makeId } from "../../services/storageService";

type SessionFormProps = {
  initial?: Partial<CompletedSession>;
  planned?: PlannedSession;
  onSubmit: (session: CompletedSession) => void;
  onCancel?: () => void;
};

function mapPlannedType(type: PlannedSession["type"]): CompletedSession["type"] {
  if (type === "rest") return "recovery";
  return type;
}

export function SessionForm({ initial, planned, onSubmit, onCancel }: SessionFormProps) {
  const plannedType = planned ? mapPlannedType(planned.type) : undefined;
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
    notes: string;
    completed: boolean;
  }>({
    id: initial?.id ?? makeId("session"),
    plannedSessionId: initial?.plannedSessionId ?? planned?.id ?? "",
    date: initial?.date ?? planned?.date ?? toISODate(new Date()),
    type: initial?.type ?? plannedType ?? "strength",
    title: initial?.title ?? planned?.title ?? "",
    durationMin: String(initial?.durationMin ?? planned?.durationMin ?? 60),
    averageHeartRate: String(initial?.averageHeartRate ?? ""),
    maxHeartRate: String(initial?.maxHeartRate ?? ""),
    caloriesBurned: String(initial?.caloriesBurned ?? ""),
    rpe: String(initial?.rpe ?? ""),
    notes: initial?.notes ?? "",
    completed: initial?.completed ?? true
  });

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const durationMin = Number(form.durationMin || 0);
    const calories = form.caloriesBurned
      ? Number(form.caloriesBurned)
      : estimateCaloriesFromSession(form.type, durationMin);

    onSubmit({
      id: form.id,
      plannedSessionId: form.plannedSessionId || undefined,
      date: form.date,
      type: form.type,
      title: form.title || SESSION_TYPE_LABELS[form.type],
      durationMin,
      averageHeartRate: form.averageHeartRate ? Number(form.averageHeartRate) : undefined,
      maxHeartRate: form.maxHeartRate ? Number(form.maxHeartRate) : undefined,
      caloriesBurned: calories,
      rpe: form.rpe ? Number(form.rpe) : undefined,
      notes: mergeSessionNotesWithPlannedExercises(form.notes, planned),
      completed: form.completed,
      exercises: buildCompletedExercises(planned, form.completed, sessionExerciseLogs) ?? initial?.exercises
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft">
      {planned ? (
        <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
          Saisis les données réelles de la séance : durée, FC moyenne/max, calories et RPE. Elles alimentent le dashboard et les statistiques.
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
            {Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        Titre
        <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Ex : Salle 1 - Force + sled" />
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

      <label className="field-label">
        Notes
        <textarea className="textarea-field" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ressenti, douleur, sommeil, ajustement..." />
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
            <Save className="h-4 w-4" /> Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
}
