import { useEffect, useState } from "react";
import { CheckCircle2, Dumbbell, PauseCircle, PlayCircle, RotateCcw, X } from "lucide-react";
import type { EnergyLevel, ExercisePrescription, PlannedSession, SessionExerciseLog } from "../../types";
import { useSessionExerciseLogs } from "../../hooks/useSessionExerciseLogs";
import {
  getActionableExercises,
  getExerciseCheckId,
  getExerciseDetailChips,
  getExerciseDisplayTitle,
  getExerciseInstruction,
  getGuidanceExercises
} from "../../utils/exerciseDisplay";
import { GaugeBar } from "../ui/GaugeBar";

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

function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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
  const exercises = getActionableExercises(session.exercises);
  const guidanceExercises = getGuidanceExercises(session.exercises);
  const checkedSet = new Set(checkedItemIds);
  const checkedCount = exercises.filter((exercise) => checkedSet.has(getExerciseCheckId(exercise))).length;
  const progress = exercises.length ? Math.round((checkedCount / exercises.length) * 100) : 0;
  const activeExerciseId = exercises.find((exercise) => !checkedSet.has(getExerciseCheckId(exercise)))?.id ?? exercises[0]?.id;
  const isBadminton = session.type === "badminton";
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return undefined;

    const interval = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

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
      <div className="sticky top-0 z-20 border-b border-petrol-800/10 bg-petrol-800/95 p-4 text-white shadow-panel backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.82rem] font-black uppercase tracking-[0.1em] text-limeSoft">Mode séance</p>
            <h1 className="mt-1 font-display text-2xl font-black tracking-[-0.055em] sm:text-3xl">{session.title}</h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-[0.06em] text-white/70">
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

      <main className="mx-auto grid max-w-5xl gap-4 p-4 pb-28">
        <section className="panel animate-[premiumIn_180ms_ease-out] p-4 motion-reduce:animate-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">{isBadminton ? "Suivi simple" : "Progression séance"}</p>
              <p className="mt-1 font-display text-2xl font-black tracking-[-0.055em] text-petrol-800 sm:text-3xl">
                {isBadminton ? "Durée, RPE, douleur si besoin" : exercises.length ? `${checkedCount}/${exercises.length} blocs utiles cochés` : "Séance guidée"}
              </p>
            </div>
            <div className="grid gap-2 sm:min-w-64">
              <div className="rounded-card border border-petrol-800/10 bg-white p-4 shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">Chrono séance</p>
                <p className="mt-1 font-display text-5xl font-black leading-none tracking-normal text-petrol-800">{formatElapsedTime(elapsedSeconds)}</p>
                {exercises.length ? (
                  <div className="mt-3">
                    <GaugeBar label="Avancement" value={progress} valueLabel={`${progress} %`} tone="lime" compact />
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="action-button min-h-11 px-3 py-2" onClick={() => setTimerRunning((current) => !current)}>
                  {timerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button type="button" className="ghost-button min-h-11 px-3 py-2" onClick={() => setElapsedSeconds(0)}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {guidanceExercises.length ? (
          <details className="panel border-l-4 border-limeSoft bg-mist/60 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
              Échauffement / consignes
              <span className="chip bg-white/80">Détails</span>
            </summary>
            <div className="mt-3 grid gap-2">
              {guidanceExercises.map((exercise) => (
                <div key={exercise.id} className="bg-white p-3">
                  <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">{exercise.block}</p>
                  <p className="mt-1 text-sm font-black text-petrol-800">{getExerciseDisplayTitle(exercise)}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-ink">{getExerciseInstruction(exercise)}</p>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        {exercises.map((exercise) => {
          const checkId = getExerciseCheckId(exercise);
          const checked = checkedSet.has(checkId);
          const active = !checked && exercise.id === activeExerciseId;
          const log = getExerciseLog(session.id, exercise.id);
          const adjustment = getExerciseAdjustment(exercise, energy);
          const detailChips = getExerciseDetailChips(exercise);

          return (
            <article
              key={exercise.id}
              className={`panel scroll-mt-28 p-3 transition duration-200 ease-out motion-reduce:transition-none sm:p-4 ${
                checked
                  ? "bg-limeSoft/30 ring-1 ring-limeSoft/70"
                  : active
                    ? "bg-white ring-2 ring-petrol-800/20 shadow-panel"
                    : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 h-11 w-11 shrink-0 accent-petrol-800"
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggle(checkId, event.target.checked)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[0.82rem] font-black uppercase tracking-[0.08em] text-muted">{exercise.block}</p>
                      <h2 className="font-display text-2xl font-black tracking-[-0.055em] text-petrol-800 sm:text-3xl">{getExerciseDisplayTitle(exercise)}</h2>
                    </div>
                    <span className={active ? "chip bg-petrol-800 text-white" : "chip"}>{active ? "Bloc actif" : `Bloc ${exercise.order}`}</span>
                  </div>

                  <p className="mt-3 rounded-card bg-mist/60 p-3 text-sm font-black leading-5 text-ink">{getExerciseInstruction(exercise)}</p>

                  {detailChips.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detailChips.map((chip) => (
                        <span key={`${chip.label}-${chip.value}`} className="chip bg-white">
                          {chip.label} : {chip.value}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 grid gap-3 sm:grid-cols-[8rem_1fr]">
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
                        placeholder="Ex : 5 x 10 m, 4 x 8, 1000 m en 4:12..."
                      />
                    </label>
                  </div>

                  {(adjustment || exercise.techniqueNotes?.length) ? (
                    <details className="mt-3 rounded-card border border-petrol-800/10 bg-white/75 p-3">
                      <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
                        Explications
                      </summary>
                      {adjustment ? <p className="mt-2 border-l-4 border-limeSoft bg-white p-3 text-xs font-bold text-ink">{adjustment}</p> : null}
                      {exercise.techniqueNotes?.length ? (
                        <p className="mt-2 text-xs font-bold leading-5 text-muted">{exercise.techniqueNotes.join(" · ")}</p>
                      ) : null}
                    </details>
                  ) : null}

                  <details className="mt-3 rounded-card border border-petrol-800/10 bg-white/75 p-3">
                    <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
                      Note rapide
                    </summary>
                    <textarea
                      className="textarea-field mt-3 min-h-20"
                      value={log?.notes ?? ""}
                      onChange={(event) => updateLog(exercise, { notes: event.target.value })}
                      placeholder="Technique, douleur, trop lourd, garder la charge..."
                    />
                  </details>
                </div>
              </div>
            </article>
          );
        })}

      </main>

      <div className="sticky bottom-0 z-20 border-t border-petrol-800/10 bg-cream/95 p-3 shadow-panel backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-card bg-white/75 p-3 text-sm font-black text-petrol-800 ring-1 ring-petrol-800/5">
            {exercises.length ? `${checkedCount}/${exercises.length} blocs cochés` : "Saisie simple"}
          </div>
          <button type="button" className="action-button min-h-14" onClick={completed ? onClose : onFinish}>
            <Dumbbell className="h-4 w-4" /> {completed ? "Fermer la séance" : "Terminer et saisir temps / FC / calories"}
          </button>
        </div>
      </div>
    </div>
  );
}
