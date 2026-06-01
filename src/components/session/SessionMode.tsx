import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Dumbbell, PauseCircle, PlayCircle, RotateCcw, X } from "lucide-react";
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
import { StatusBadge } from "../ui/StatusBadge";

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

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
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
  const exercises = useMemo(() => getActionableExercises(session.exercises), [session.exercises]);
  const guidanceExercises = useMemo(() => getGuidanceExercises(session.exercises), [session.exercises]);
  const checkedSet = useMemo(() => new Set(checkedItemIds), [checkedItemIds]);
  const firstOpenIndex = Math.max(
    0,
    exercises.findIndex((exercise) => !checkedSet.has(getExerciseCheckId(exercise)))
  );
  const [activeIndex, setActiveIndex] = useState(firstOpenIndex);
  const [skippedItemIds, setSkippedItemIds] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const checkedCount = exercises.filter((exercise) => checkedSet.has(getExerciseCheckId(exercise))).length;
  const skippedSet = useMemo(() => new Set(skippedItemIds), [skippedItemIds]);
  const skippedCount = exercises.filter((exercise) => skippedSet.has(getExerciseCheckId(exercise))).length;
  const progress = exercises.length ? Math.round((checkedCount / exercises.length) * 100) : 0;
  const activeExercise = exercises[activeIndex];
  const activeCheckId = activeExercise ? getExerciseCheckId(activeExercise) : undefined;
  const activeChecked = activeCheckId ? checkedSet.has(activeCheckId) : false;
  const activeSkipped = activeCheckId ? skippedSet.has(activeCheckId) : false;
  const isBadminton = session.type === "badminton";

  useEffect(() => {
    setActiveIndex(firstOpenIndex);
    setSkippedItemIds([]);
  }, [session.id]);

  useEffect(() => {
    setActiveIndex((current) => clampIndex(current, exercises.length));
  }, [exercises.length]);

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

  const goToBlock = (index: number) => {
    setActiveIndex(clampIndex(index, exercises.length));
  };

  const goNextBlock = () => {
    setActiveIndex((current) => clampIndex(current + 1, exercises.length));
  };

  const goPreviousBlock = () => {
    setActiveIndex((current) => clampIndex(current - 1, exercises.length));
  };

  const handleBlockDecision = (done: boolean) => {
    if (!activeCheckId) return;

    setSkippedItemIds((current) => {
      if (done) return current.filter((id) => id !== activeCheckId);
      return [...new Set([...current, activeCheckId])];
    });
    onToggle(activeCheckId, done);
    if (activeIndex < exercises.length - 1) goNextBlock();
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch?.clientX ?? null;
    touchStartY.current = touch?.clientY ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    if (!touch || touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
    if (deltaX < 0) goNextBlock();
    if (deltaX > 0) goPreviousBlock();
  };

  const activeStatus = activeChecked ? "Fait" : activeSkipped ? "Passé" : "À faire";
  const activeStatusTone = activeChecked ? "lime" : activeSkipped ? "muted" : "info";
  const detailChips = activeExercise ? getExerciseDetailChips(activeExercise) : [];
  const activeLog = activeExercise ? getExerciseLog(session.id, activeExercise.id) : undefined;
  const activeAdjustment = activeExercise ? getExerciseAdjustment(activeExercise, energy) : undefined;

  return (
    <div className="fixed inset-0 z-[80] flex min-h-svh flex-col overflow-hidden bg-cream text-ink">
      <header className="shrink-0 border-b border-petrol-800/10 bg-petrol-800/95 p-3 text-white shadow-panel backdrop-blur-xl sm:p-4">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.1em] text-limeSoft">Mode séance</p>
            <h1 className="mt-1 break-words font-display text-2xl font-black leading-none tracking-[-0.055em] sm:text-3xl">
              {session.title}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.06em] text-white/70">
              {session.day} - {session.durationMin} min - {session.rpeTarget}
            </p>
          </div>
          <button
            type="button"
            className="ghost-button min-h-11 shrink-0 border-white/20 bg-white/10 px-3 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Fermer le mode séance"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 sm:px-4">
        <section className="panel animate-[premiumIn_180ms_ease-out] p-3 motion-reduce:animate-none sm:p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem] sm:items-center">
            <div className="min-w-0">
              <p className="eyebrow">{isBadminton ? "Suivi simple" : "Bloc actif"}</p>
              <p className="mt-1 font-display text-2xl font-black leading-none tracking-[-0.055em] text-petrol-800 sm:text-3xl">
                {exercises.length ? `${activeIndex + 1}/${exercises.length}` : "Saisie libre"}
              </p>
              <p className="mt-2 text-sm font-bold text-muted">
                {exercises.length ? `${checkedCount} fait${checkedCount > 1 ? "s" : ""}${skippedCount ? `, ${skippedCount} passé${skippedCount > 1 ? "s" : ""}` : ""}` : "Aucun bloc guidé à cocher."}
              </p>
            </div>
            <div className="rounded-card border border-petrol-800/10 bg-white/80 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">Chrono</p>
                  <p className="mt-1 font-display text-4xl font-black leading-none tracking-normal text-petrol-800">
                    {formatElapsedTime(elapsedSeconds)}
                  </p>
                </div>
                <button
                  type="button"
                  className="action-button min-h-11 w-auto px-3 py-2"
                  onClick={() => setTimerRunning((current) => !current)}
                  aria-label={timerRunning ? "Mettre le chrono en pause" : "Démarrer le chrono"}
                >
                  {timerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                </button>
              </div>
              {exercises.length ? (
                <div className="mt-3">
                  <GaugeBar label="Avancement" value={progress} valueLabel={`${progress} %`} tone="lime" compact />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {guidanceExercises.length ? (
          <details className="panel border-l-4 border-limeSoft bg-mist/60 p-3 sm:p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
              Échauffement / consignes
              <span className="chip bg-white/80">Replié</span>
            </summary>
            <div className="mt-3 grid gap-2">
              {guidanceExercises.map((exercise) => (
                <div key={exercise.id} className="rounded-card bg-white/80 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.06em] text-muted">{exercise.block}</p>
                  <p className="mt-1 text-sm font-black text-petrol-800">{getExerciseDisplayTitle(exercise)}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-ink">{getExerciseInstruction(exercise)}</p>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        {exercises.length ? (
          <details className="panel p-3 sm:p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
              Tous les blocs
              <span className="chip bg-white/80">{checkedCount}/{exercises.length}</span>
            </summary>
            <div className="mt-3 grid gap-2">
              {exercises.map((exercise, index) => {
                const checkId = getExerciseCheckId(exercise);
                const isDone = checkedSet.has(checkId);
                const isSkipped = skippedSet.has(checkId);
                const isActive = index === activeIndex;

                return (
                  <div
                    key={exercise.id}
                    className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-card border p-3 transition ${
                      isActive ? "border-petrol-800/25 bg-limeSoft/25" : "border-petrol-800/10 bg-white/75"
                    }`}
                  >
                    <input
                      className="h-5 w-5 shrink-0 accent-petrol-800"
                      type="checkbox"
                      checked={isDone}
                      onChange={(event) => {
                        onToggle(checkId, event.target.checked);
                        if (event.target.checked) {
                          setSkippedItemIds((current) => current.filter((id) => id !== checkId));
                        }
                      }}
                      aria-label={`Valider ${getExerciseDisplayTitle(exercise)}`}
                    />
                    <button type="button" className="min-w-0 text-left" onClick={() => goToBlock(index)}>
                      <span className="block truncate text-[0.68rem] font-black uppercase tracking-[0.08em] text-muted">
                        Bloc {index + 1}
                      </span>
                      <span className={`block truncate text-sm font-black ${isDone ? "text-muted line-through" : "text-petrol-800"}`}>
                        {getExerciseDisplayTitle(exercise)}
                      </span>
                    </button>
                    <StatusBadge tone={isDone ? "lime" : isSkipped ? "muted" : isActive ? "info" : "muted"}>
                      {isDone ? "Fait" : isSkipped ? "Passé" : isActive ? "Actif" : "À faire"}
                    </StatusBadge>
                  </div>
                );
              })}
            </div>
          </details>
        ) : null}

        {activeExercise ? (
          <section className="flex min-h-0 flex-1 flex-col">
            <article
              key={activeExercise.id}
              className="panel flex min-h-[min(34rem,calc(100svh-22rem))] flex-1 touch-pan-y flex-col justify-between overflow-visible p-4 shadow-panel animate-[blockSwipeIn_190ms_ease-out] motion-reduce:animate-none sm:p-5"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-live="polite"
            >
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-muted">{activeExercise.block}</p>
                    <h2 className="mt-1 break-words font-display text-3xl font-black leading-[0.92] tracking-[-0.06em] text-petrol-800 sm:text-4xl">
                      {getExerciseDisplayTitle(activeExercise)}
                    </h2>
                  </div>
                  <StatusBadge tone={activeStatusTone}>{activeStatus}</StatusBadge>
                </div>

                <p className="mt-4 rounded-card bg-mist/60 p-3 text-sm font-black leading-5 text-ink">
                  {getExerciseInstruction(activeExercise)}
                </p>

                {detailChips.length ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {detailChips.map((chip) => (
                      <div key={`${chip.label}-${chip.value}`} className="rounded-card bg-white/80 p-3 ring-1 ring-petrol-800/5">
                        <p className="text-[0.66rem] font-black uppercase tracking-[0.08em] text-muted">{chip.label}</p>
                        <p className="mt-1 text-sm font-black text-petrol-800">{chip.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-[9rem_1fr]">
                  <label className="field-label">
                    Charge
                    <input
                      className="field"
                      inputMode="decimal"
                      value={activeLog?.loadKg ?? ""}
                      onChange={(event) => updateLog(activeExercise, { loadKg: parseOptionalNumber(event.target.value) })}
                      placeholder="kg"
                    />
                  </label>
                  <label className="field-label">
                    Réalisé
                    <input
                      className="field"
                      value={activeLog?.doneText ?? ""}
                      onChange={(event) => updateLog(activeExercise, { doneText: event.target.value })}
                      placeholder="Ex : 4 x 8, 1000 m en 4:12..."
                    />
                  </label>
                </div>

                {(activeAdjustment || activeExercise.techniqueNotes?.length) ? (
                  <details className="mt-3 rounded-card border border-petrol-800/10 bg-white/75 p-3">
                    <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
                      Explications
                    </summary>
                    {activeAdjustment ? <p className="mt-2 border-l-4 border-limeSoft bg-white p-3 text-xs font-bold text-ink">{activeAdjustment}</p> : null}
                    {activeExercise.techniqueNotes?.length ? (
                      <p className="mt-2 text-xs font-bold leading-5 text-muted">{activeExercise.techniqueNotes.join(" · ")}</p>
                    ) : null}
                  </details>
                ) : null}

                <details className="mt-3 rounded-card border border-petrol-800/10 bg-white/75 p-3">
                  <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
                    Note rapide
                  </summary>
                  <textarea
                    className="textarea-field mt-3 min-h-20"
                    value={activeLog?.notes ?? ""}
                    onChange={(event) => updateLog(activeExercise, { notes: event.target.value })}
                    placeholder="Technique, douleur, trop lourd, garder la charge..."
                  />
                </details>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-center gap-1.5" aria-label={`Bloc ${activeIndex + 1} sur ${exercises.length}`}>
                  {exercises.map((exercise, index) => {
                    const checkId = getExerciseCheckId(exercise);
                    const isDone = checkedSet.has(checkId);
                    const isSkipped = skippedSet.has(checkId);
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        className={`h-2.5 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                          isActive ? "w-8 bg-petrol-800" : isDone ? "w-2.5 bg-limeSoft" : isSkipped ? "w-2.5 bg-petrol-800/35" : "w-2.5 bg-petrol-800/15"
                        }`}
                        onClick={() => goToBlock(index)}
                        aria-label={`Aller au bloc ${index + 1}`}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" className="ghost-button min-h-14 justify-center" onClick={() => handleBlockDecision(false)}>
                    Pas fait
                  </button>
                  <button type="button" className="action-button min-h-14 justify-center" onClick={() => handleBlockDecision(true)}>
                    <CheckCircle2 className="h-4 w-4" /> Fait
                  </button>
                </div>
              </div>
            </article>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="ghost-button justify-center" onClick={goPreviousBlock} disabled={activeIndex === 0}>
                <ArrowLeft className="h-4 w-4" /> Précédent
              </button>
              <button type="button" className="ghost-button justify-center" onClick={goNextBlock} disabled={activeIndex >= exercises.length - 1}>
                Suivant <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        ) : (
          <section className="panel flex min-h-[calc(100svh-24rem)] flex-1 flex-col justify-center p-5 text-center shadow-panel">
            <p className="eyebrow">Séance libre</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-none tracking-[-0.06em] text-petrol-800">
              Aucun bloc guidé
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-muted">
              Tu peux garder le chrono, puis saisir le réel de la séance quand tu as terminé.
            </p>
            <button type="button" className="action-button mx-auto mt-5" onClick={onFinish}>
              Saisir les données
            </button>
          </section>
        )}
      </main>

      <footer className="shrink-0 border-t border-petrol-800/10 bg-cream/95 p-3 shadow-panel backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <div className="rounded-card bg-white/75 p-3 text-sm font-black text-petrol-800 ring-1 ring-petrol-800/5">
            {exercises.length ? `${checkedCount}/${exercises.length} blocs faits` : "Saisie simple"}
          </div>
          {completed ? (
            <button type="button" className="ghost-button justify-center" onClick={onUndo}>
              <RotateCcw className="h-4 w-4" /> Annuler fait
            </button>
          ) : (
            <button type="button" className="ghost-button justify-center" onClick={() => setElapsedSeconds(0)}>
              Reset chrono
            </button>
          )}
          <button type="button" className="action-button min-h-14 justify-center" onClick={completed ? onClose : onFinish}>
            <Dumbbell className="h-4 w-4" /> {completed ? "Fermer" : "Terminer"}
          </button>
        </div>
      </footer>
    </div>
  );
}
