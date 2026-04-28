import { CheckCircle2, Dumbbell, RotateCcw, X } from "lucide-react";
import type { EnergyLevel, ExercisePrescription, PlannedSession, SessionExerciseLog } from "../../types";
import { useSessionExerciseLogs } from "../../hooks/useSessionExerciseLogs";

function getExerciseCheckId(exercise: ExercisePrescription) {
  return `exercise:${exercise.id}`;
}

function formatExercisePrescription(exercise: ExercisePrescription) {
  if (exercise.sets && exercise.distanceM) return `${exercise.sets} x ${exercise.distanceM} m`;
  if (exercise.sets && exercise.repsText) return `${exercise.sets} x ${exercise.repsText}`;
  if (exercise.sets && exercise.reps) return `${exercise.sets} x ${exercise.reps}`;
  if (exercise.repsText) return exercise.repsText;
  if (exercise.distanceM) return `${exercise.distanceM} m`;
  if (exercise.durationSec) return `${exercise.durationSec} s`;
  return "Prescription à ajuster";
}

function getExerciseAdjustment(exercise: ExercisePrescription, energy: EnergyLevel) {
  if (energy === "fatigue") return exercise.fatigueAdjustment;
  if (energy === "strong") return exercise.strongAdjustment;
  return undefined;
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function SessionMode({
  session,
  energy,
  checkedItemIds,
  completed,
  onToggle,
  onClose,
  onFinish,
  onUndo
}: {
  session: PlannedSession;
  energy: EnergyLevel;
  checkedItemIds: string[];
  completed: boolean;
  onToggle: (itemId: string, checked: boolean) => void;
  onClose: () => void;
  onFinish: () => void;
  onUndo: () => void;
}) {
  const { getExerciseLog, saveExerciseLog } = useSessionExerciseLogs(session.id);
  const exercises = [...(session.exercises ?? [])].sort((a, b) => a.order - b.order);
  const checkedSet = new Set(checkedItemIds);
  const checkedCount = exercises.filter((exercise) => checkedSet.has(getExerciseCheckId(exercise))).length;
  const progress = exercises.length ? Math.round((checkedCount / exercises.length) * 100) : 0;

  const updateLog = (exercise: ExercisePrescription, patch: Partial<SessionExerciseLog>) => {
    const current = getExerciseLog(session.id, exercise.id);
    saveExerciseLog({
      plannedSessionId: session.id,
      exerciseId: exercise.id,
      ...current,
      ...patch
    });
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-cream text-ink">
      <div className="sticky top-0 z-10 border-b border-petrol-800/10 bg-petrol-800 p-4 text-white shadow-panel">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Mode séance</p>
            <h1 className="mt-1 font-display text-3xl font-black tracking-[-0.06em]">{session.title}</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/60">
              {session.day} - {session.durationMin} min - {session.rpeTarget}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="ghost-button border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={onClose}>
              <X className="h-4 w-4" /> Fermer
            </button>
            {completed ? (
              <button type="button" className="ghost-button border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={onUndo}>
                <RotateCcw className="h-4 w-4" /> Annuler fait
              </button>
            ) : (
              <button type="button" className="action-button bg-limeSoft text-petrol-900 hover:bg-white" onClick={onFinish}>
                <CheckCircle2 className="h-4 w-4" /> Saisir les données
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-4 p-4 pb-10">
        <section className="panel p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Progression séance</p>
              <p className="mt-1 font-display text-3xl font-black tracking-[-0.06em] text-petrol-800">
                {checkedCount}/{exercises.length} exercices cochés
              </p>
            </div>
            <span className="chip">{progress}%</span>
          </div>
          <div className="mt-4 h-3 bg-mist">
            <div className="h-full bg-limeSoft" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {exercises.map((exercise) => {
          const checkId = getExerciseCheckId(exercise);
          const checked = checkedSet.has(checkId);
          const log = getExerciseLog(session.id, exercise.id);
          const adjustment = getExerciseAdjustment(exercise, energy);

          return (
            <article key={exercise.id} className={`panel p-4 ${checked ? "bg-limeSoft/30" : "bg-white"}`}>
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 h-7 w-7 shrink-0 accent-petrol-800"
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggle(checkId, event.target.checked)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted">{exercise.block}</p>
                      <h2 className="font-display text-3xl font-black tracking-[-0.06em] text-petrol-800">{exercise.name}</h2>
                    </div>
                    <span className="chip">{formatExercisePrescription(exercise)}</span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="bg-white p-3">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Charge prévue</p>
                      <p className="mt-1 text-sm font-black text-petrol-800">{exercise.targetLoadText ?? "Au feeling"}</p>
                    </div>
                    <div className="bg-white p-3">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Repos</p>
                      <p className="mt-1 text-sm font-black text-petrol-800">{exercise.restText ?? "Libre"}</p>
                    </div>
                    <div className="bg-white p-3">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">RPE cible</p>
                      <p className="mt-1 text-sm font-black text-petrol-800">{exercise.rpeTarget ?? "Contrôlé"}</p>
                    </div>
                  </div>

                  {adjustment ? <p className="mt-3 border-l-4 border-limeSoft bg-white p-3 text-xs font-bold text-ink">{adjustment}</p> : null}

                  <div className="mt-4 grid gap-3 sm:grid-cols-[8rem_1fr]">
                    <label className="field-label">
                      Charge réelle
                      <input
                        className="field"
                        inputMode="decimal"
                        value={log?.loadKg ?? ""}
                        onChange={(event) => updateLog(exercise, { loadKg: parseOptionalNumber(event.target.value) })}
                        placeholder="kg"
                      />
                    </label>
                    <label className="field-label">
                      Réalisé
                      <input
                        className="field"
                        value={log?.doneText ?? ""}
                        onChange={(event) => updateLog(exercise, { doneText: event.target.value })}
                        placeholder="Ex : 5 x 12,5 m, 4 x 8, 1000 m en 4:12..."
                      />
                    </label>
                  </div>

                  <label className="field-label mt-3">
                    Note rapide
                    <textarea
                      className="textarea-field min-h-20"
                      value={log?.notes ?? ""}
                      onChange={(event) => updateLog(exercise, { notes: event.target.value })}
                      placeholder="Technique, douleur, trop lourd, garder la charge, augmenter la prochaine fois..."
                    />
                  </label>
                </div>
              </div>
            </article>
          );
        })}

        <button type="button" className="action-button min-h-14" onClick={completed ? onClose : onFinish}>
          <Dumbbell className="h-4 w-4" /> {completed ? "Fermer la séance" : "Terminer et saisir temps / FC / calories"}
        </button>
      </main>
    </div>
  );
}
