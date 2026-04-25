import { useState } from "react";
import { Edit3, Plus, Trash2, Dumbbell } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { SESSION_TYPE_LABELS } from "../data/defaults";
import { useSessions } from "../hooks/useSessions";
import type { CompletedSession, CompletedSessionType } from "../types";
import { formatLongDate } from "../utils/dates";
import { getAverageHeartRate, getAverageRpe } from "../utils/training";

const filters: Array<CompletedSessionType | "all"> = ["all", "badminton", "strength", "run", "hyrox", "recovery", "other"];

function CompletedExercisesList({ session }: { session: CompletedSession }) {
  if (!session.exercises?.length) return null;

  return (
    <details className="mt-4 border border-petrol-800/10 bg-mist/45 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Exercices enregistrés</p>
            <p className="font-display text-xl font-black tracking-[-0.04em] text-petrol-800">
              {session.exercises.length} blocs liés au planning
            </p>
          </div>
          <span className="chip">Détails</span>
        </div>
      </summary>

      <div className="mt-3 grid gap-2">
        {session.exercises.map((exercise, index) => (
          <div key={`${exercise.prescriptionId ?? exercise.name}-${index}`} className="border-l-4 border-limeSoft bg-white p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-petrol-800">{exercise.name}</p>
                {exercise.notes ? <p className="mt-1 text-xs font-bold leading-5 text-muted">{exercise.notes}</p> : null}
              </div>
              <span className="chip">{exercise.completed ? "validé" : "prévu"}</span>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function SessionsPage() {
  const { sessions, saveSession, deleteSession } = useSessions();
  const [filter, setFilter] = useState<CompletedSessionType | "all">("all");
  const [editing, setEditing] = useState<CompletedSession | null>(null);
  const [showForm, setShowForm] = useState(false);
  const filtered = filter === "all" ? sessions : sessions.filter((session) => session.type === filter);
  const totalCalories = filtered.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const totalVolume = filtered.reduce((total, session) => total + session.durationMin, 0);

  return (
    <>
      <PageHeader
        eyebrow="Historique"
        title="Séances réalisées"
        description="Tout ce que tu as vraiment fait : durée, FC, calories, RPE et notes. Le plan compte, mais le réel pilote."
        action={
          <button className="action-button" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Ajouter une séance
          </button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Séances filtrées" value={filtered.length} />
        <MetricCard label="Volume" value={`${totalVolume} min`} />
        <MetricCard label="Calories sport" value={totalCalories} />
        <MetricCard label="RPE moyen" value={getAverageRpe(filtered) || "—"} />
      </section>

      {showForm || editing ? (
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">{editing ? "Modifier" : "Ajouter"}</p>
          <h2 className="title-lg mt-2">{editing ? editing.title : "Nouvelle séance"}</h2>
          <div className="mt-5">
            <SessionForm
              initial={editing ?? undefined}
              onCancel={() => {
                setEditing(null);
                setShowForm(false);
              }}
              onSubmit={(session) => {
                saveSession(session);
                setEditing(null);
                setShowForm(false);
              }}
            />
          </div>
        </SectionCard>
      ) : null}

      <SectionCard className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "action-button" : "ghost-button"}
              onClick={() => setFilter(item)}
            >
              {item === "all" ? "Tout" : SESSION_TYPE_LABELS[item]}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {filtered.length ? (
            filtered.map((session) => (
              <article key={session.id} className="border border-petrol-800/10 bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow">{formatLongDate(session.date)}</p>
                    <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{session.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">{SESSION_TYPE_LABELS[session.type]}</span>
                      <span className="chip">{session.durationMin} min</span>
                      {session.caloriesBurned ? <span className="chip">{session.caloriesBurned} kcal</span> : null}
                      {session.rpe ? <span className="chip">RPE {session.rpe}</span> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="ghost-button" onClick={() => setEditing(session)} aria-label="Modifier la séance">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        if (window.confirm("Supprimer cette séance ?")) deleteSession(session.id);
                      }}
                      aria-label="Supprimer la séance"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricCard label="FC moyenne" value={session.averageHeartRate ?? "—"} />
                  <MetricCard label="FC max" value={session.maxHeartRate ?? "—"} />
                  <MetricCard label="FC moy. filtre" value={getAverageHeartRate([session]) || "—"} />
                </div>

                {session.notes ? (
                  <p className="mt-4 whitespace-pre-line border-l-4 border-limeSoft bg-mist/50 p-4 text-sm font-semibold text-ink">
                    {session.notes}
                  </p>
                ) : null}
                <CompletedExercisesList session={session} />
              </article>
            ))
          ) : (
            <EmptyState icon={Dumbbell} title="Aucune séance" message="Ajoute ta première séance ou change le filtre." />
          )}
        </div>
      </SectionCard>
    </>
  );
}
