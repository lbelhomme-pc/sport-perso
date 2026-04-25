import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { WeightEntry } from "../../types";
import { toISODate } from "../../utils/dates";
import { makeId } from "../../services/storageService";

type WeightFormProps = {
  initial?: Partial<WeightEntry>;
  onSubmit: (entry: WeightEntry) => void;
  onCancel?: () => void;
};

export function WeightForm({ initial, onSubmit, onCancel }: WeightFormProps) {
  const [form, setForm] = useState({
    id: initial?.id ?? makeId("weight"),
    date: initial?.date ?? toISODate(new Date()),
    weight: String(initial?.weight ?? ""),
    notes: initial?.notes ?? ""
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      id: form.id,
      date: form.date,
      weight: Number(form.weight),
      notes: form.notes || undefined
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr]">
        <label className="field-label">
          Date
          <input className="field" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
        </label>
        <label className="field-label">
          Poids
          <input className="field" type="number" min="30" step="0.1" value={form.weight} onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))} required />
        </label>
        <label className="field-label">
          Notes
          <input className="field" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Sommeil, rétention, repas salé..." />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            <X className="h-4 w-4" /> Annuler
          </button>
        ) : null}
        <button type="submit" className="action-button">
          <Save className="h-4 w-4" /> Enregistrer
        </button>
      </div>
    </form>
  );
}
