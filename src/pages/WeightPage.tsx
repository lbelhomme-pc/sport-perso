import { useState } from "react";
import { Edit3, Plus, Scale, Trash2 } from "lucide-react";
import { MetricLineChart } from "../components/charts/MetricLineChart";
import { WeightForm } from "../components/forms/WeightForm";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SectionCard } from "../components/ui/SectionCard";
import { getWeightTrend } from "../services/recommendationService";
import { useSettings } from "../hooks/useSettings";
import { useWeight } from "../hooks/useWeight";
import type { WeightEntry } from "../types";
import { formatShortDate } from "../utils/dates";

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
}

function trendMessage(trend7: number) {
  if (trend7 <= -1) return "baisse trop rapide";
  if (trend7 < -0.2) return "baisse normale";
  if (trend7 <= 0.2) return "poids stable";
  return "attention récupération";
}

export default function WeightPage() {
  const { settings } = useSettings();
  const { weights, saveWeight, deleteWeight } = useWeight();
  const [editing, setEditing] = useState<WeightEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const latest = weights[weights.length - 1];
  const targetWeight = settings.startWeight - settings.targetWeightLoss;
  const lost = latest ? Math.max(0, settings.startWeight - latest.weight) : 0;
  const progress = settings.targetWeightLoss > 0 ? Math.min(100, (lost / settings.targetWeightLoss) * 100) : 0;
  const weeklyAverage = average(weights.slice(-7).map((entry) => entry.weight));
  const trend7 = getWeightTrend(weights, 7);
  const trend30 = getWeightTrend(weights, 30);
  const chartData = weights.map((entry) => ({
    date: formatShortDate(entry.date),
    poids: entry.weight
  }));

  return (
    <>
      <PageHeader
        eyebrow="Poids"
        title="Tendance, pas panique"
        description="Le poids sert à piloter la tendance, pas à juger une journée. Moyenne hebdomadaire, objectif -6 kg et signaux sobres."
        action={
          <button className="action-button" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Ajouter poids
          </button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Poids actuel" value={latest ? `${latest.weight} kg` : "—"} />
        <MetricCard label="Moyenne 7 entrées" value={weeklyAverage ? `${weeklyAverage} kg` : "—"} />
        <MetricCard label="Objectif" value={`${targetWeight} kg`} />
        <MetricCard label="Tendance 7 j" value={`${trend7 > 0 ? "+" : ""}${trend7} kg`} />
        <MetricCard label="Tendance 30 j" value={`${trend30 > 0 ? "+" : ""}${trend30} kg`} />
      </section>

      <SectionCard className="p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <div>
            <p className="eyebrow">Progression vers -{settings.targetWeightLoss} kg</p>
            <h2 className="title-lg mt-2">{Math.round(progress)} %</h2>
            <div className="mt-5">
              <ProgressBar value={progress} max={100} tone="lime" />
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-muted">
              Message : <span className="font-black text-petrol-800">{trendMessage(trend7)}</span>. Si la baisse devient trop rapide,
              remonte légèrement les calories ou baisse la version des séances.
            </p>
          </div>
          <div className="bg-limeSoft p-5 text-petrol-900">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em]">Repère</p>
            <p className="mt-3 font-display text-3xl font-black tracking-[-0.06em]">
              {latest ? `${Math.round((settings.startWeight - latest.weight) * 10) / 10} kg` : "0 kg"}
            </p>
            <p className="mt-2 text-sm font-bold opacity-75">perdus depuis le poids de départ configuré.</p>
          </div>
        </div>
      </SectionCard>

      {showForm || editing ? (
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">{editing ? "Modifier" : "Ajout rapide"}</p>
          <h2 className="title-lg mt-2">{editing ? `${editing.weight} kg` : "Poids du jour"}</h2>
          <div className="mt-5">
            <WeightForm
              initial={editing ?? undefined}
              onCancel={() => {
                setEditing(null);
                setShowForm(false);
              }}
              onSubmit={(entry) => {
                saveWeight(entry);
                setEditing(null);
                setShowForm(false);
              }}
            />
          </div>
        </SectionCard>
      ) : null}

      <SectionCard className="p-5 sm:p-6">
        <p className="eyebrow">Graphique poids</p>
        <h2 className="title-lg mt-2">Évolution</h2>
        {chartData.length ? <MetricLineChart data={chartData} xKey="date" yKey="poids" suffix=" kg" /> : <EmptyState icon={Scale} title="Aucun poids" message="Ajoute une première entrée pour afficher la courbe." />}
      </SectionCard>

      <SectionCard className="p-5 sm:p-6">
        <p className="eyebrow">Historique</p>
        <div className="mt-4 grid gap-3">
          {weights.length ? (
            [...weights].reverse().map((entry) => (
              <article key={entry.id} className="flex flex-col gap-3 border border-petrol-800/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{entry.weight} kg</p>
                  <p className="text-sm font-bold text-muted">{formatShortDate(entry.date)}</p>
                  {entry.notes ? <p className="mt-2 text-sm font-semibold text-ink">{entry.notes}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button className="ghost-button" onClick={() => setEditing(entry)} aria-label="Modifier le poids">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    className="ghost-button"
                    onClick={() => {
                      if (window.confirm("Supprimer cette entrée de poids ?")) deleteWeight(entry.id);
                    }}
                    aria-label="Supprimer le poids"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState icon={Scale} title="Aucune entrée" message="La première mesure crée la ligne de départ." />
          )}
        </div>
      </SectionCard>
    </>
  );
}
