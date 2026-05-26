import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, ListChecks, Pencil, PlayCircle, RotateCcw } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { BadmintonVariantSelector } from "../components/planning/BadmintonVariantSelector";
import { SessionMode } from "../components/session/SessionMode";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { buildPhases } from "../data/phases";
import { getSessionChecklist } from "../data/sessionChecklists";
import { getDisplayedVersion, getPlannedWeek, getTrainingContext } from "../data/trainingPlan";
import { applyPlannedSessionOverride, usePlanningOverrides } from "../hooks/usePlanningOverrides";
import { useSessionChecklists } from "../hooks/useSessionChecklists";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import type { EnergyLevel, ExercisePrescription, PlannedSession, SessionChecklistItem } from "../types";
import { getCurrentWeekIndex, getTotalWeeks } from "../utils/dates";
import {
  getActionableExercises,
  getExerciseCheckId,
  getExerciseDetailChips,
  getExerciseDisplayTitle,
  getExerciseInstruction,
  getGuidanceExercises
} from "../utils/exerciseDisplay";
import { getCompletedForPlan, getPlannedCompletionMap } from "../utils/training";
import { getPlannedTypeLabel, getProgramLabel, hideHyroxWhenGeneral, isHyroxCompetitionMode, personalizePlannedSession } from "../utils/sportLabels";

function groupChecklistItems(items: SessionChecklistItem[]) {
  return items.reduce<Array<{ group: string; items: SessionChecklistItem[] }>>((groups, item) => {
    const existing = groups.find((group) => group.group === item.group);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ group: item.group, items: [item] });
    }
    return groups;
  }, []);
}

function getExerciseAdjustment(exercise: ExercisePrescription, energy: EnergyLevel) {
  if (energy === "fatigue") return exercise.fatigueAdjustment;
  if (energy === "strong") return exercise.strongAdjustment;
  return undefined;
}

function SessionChecklistPanel({
  items,
  checkedItemIds,
  onToggle,
  onCheckAll,
  onReset
}: {
  items: SessionChecklistItem[];
  checkedItemIds: string[];
  onToggle: (itemId: string, checked: boolean) => void;
  onCheckAll: () => void;
  onReset: () => void;
}) {
  const checkedSet = new Set(checkedItemIds);
  const checkedCount = items.filter((item) => checkedSet.has(item.id)).length;
  const progress = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <details className="mt-4 border border-petrol-800/10 bg-white p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-petrol-800 text-limeSoft">
              <ListChecks className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Prépa + clôture</p>
              <p className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">
                {checkedCount}/{items.length} validés
              </p>
            </div>
          </div>
          <div className="h-2 w-full bg-mist sm:w-36">
            <div className="h-full bg-limeSoft" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </summary>

      <div className="mt-4 grid gap-4">
        {groupChecklistItems(items).map((group) => (
          <div key={group.group} className="border-l-4 border-limeSoft bg-mist/45 p-3">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-petrol-800">{group.group}</p>
            <div className="mt-3 grid gap-2">
              {group.items.map((item) => (
                <label key={item.id} className="flex items-start gap-3 bg-white p-3 text-sm font-bold leading-5 text-ink">
                  <input
                    className="mt-1 h-5 w-5 shrink-0 accent-petrol-800"
                    type="checkbox"
                    checked={checkedSet.has(item.id)}
                    onChange={(event) => onToggle(item.id, event.target.checked)}
                  />
                  <span className={checkedSet.has(item.id) ? "text-muted line-through" : undefined}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="action-button" onClick={onCheckAll}>
          Tout cocher prépa
        </button>
        <button type="button" className="ghost-button" onClick={onReset}>
          Réinitialiser prépa
        </button>
      </div>
    </details>
  );
}

function ExercisePrescriptionPanel({
  exercises,
  energy,
  checkedItemIds,
  onToggle
}: {
  exercises?: ExercisePrescription[];
  energy: EnergyLevel;
  checkedItemIds: string[];
  onToggle: (itemId: string, checked: boolean) => void;
}) {
  if (!exercises?.length) return null;

  const checkedSet = new Set(checkedItemIds);
  const actionableExercises = getActionableExercises(exercises);
  const guidanceExercises = getGuidanceExercises(exercises);
  const checkedCount = actionableExercises.filter((exercise) => checkedSet.has(getExerciseCheckId(exercise))).length;
  const progressLabel = actionableExercises.length ? `${checkedCount}/${actionableExercises.length} blocs utiles validés` : "Consignes de séance";

  return (
    <details className="mt-4 border border-petrol-800/10 bg-white p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Déroulé intelligent</p>
            <p className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">
              {progressLabel}
            </p>
          </div>
          <span className="chip">Moins de clics</span>
        </div>
      </summary>

      {guidanceExercises.length ? (
        <div className="mt-4 border-l-4 border-limeSoft bg-mist/45 p-4">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-petrol-800">Prépa / consignes</p>
          <div className="mt-3 grid gap-2">
            {guidanceExercises.map((exercise) => (
              <div key={exercise.id} className="bg-white p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">{exercise.block}</p>
                <p className="mt-1 text-sm font-black text-petrol-800">{getExerciseDisplayTitle(exercise)}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-ink">{getExerciseInstruction(exercise)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        {actionableExercises.map((exercise) => {
          const checkId = getExerciseCheckId(exercise);
          const checked = checkedSet.has(checkId);
          const adjustment = getExerciseAdjustment(exercise, energy);
          const detailChips = getExerciseDetailChips(exercise);

          return (
            <article key={exercise.id} className={`border border-petrol-800/10 p-3 ${checked ? "bg-limeSoft/25" : "bg-mist/35"}`}>
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 h-6 w-6 shrink-0 accent-petrol-800"
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggle(checkId, event.target.checked)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">{exercise.block}</p>
                      <h3 className={`font-display text-xl font-black tracking-[-0.04em] ${checked ? "text-muted line-through" : "text-petrol-800"}`}>
                        {getExerciseDisplayTitle(exercise)}
                      </h3>
                    </div>
                    <span className="chip">Bloc {exercise.order}</span>
                  </div>

                  <p className="mt-3 bg-white p-3 text-sm font-black leading-5 text-ink">{getExerciseInstruction(exercise)}</p>

                  {detailChips.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detailChips.map((chip) => (
                        <span key={`${chip.label}-${chip.value}`} className="chip bg-white">
                          {chip.label} : {chip.value}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {adjustment ? <p className="mt-3 border-l-4 border-limeSoft bg-white p-3 text-xs font-bold text-ink">{adjustment}</p> : null}
                  {exercise.techniqueNotes?.length ? (
                    <p className="mt-3 text-xs font-bold leading-5 text-muted">{exercise.techniqueNotes.join(" · ")}</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!actionableExercises.length ? (
        <p className="mt-4 border border-petrol-800/10 bg-white p-3 text-sm font-bold text-muted">
          Rien à cocher ici.
        </p>
      ) : null}
    </details>
  );
}

export default function PlanningPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { settings, saveSettings } = useSettings();
  const { sessions, saveSession, deleteSession, deletePlannedSessionCompletion } = useSessions();
  const { getCheckedItemIds, saveChecklist, toggleChecklistItem } = useSessionChecklists();
  const { getOverride } = usePlanningOverrides();
  const totalWeeks = getTotalWeeks(settings.startDate, settings.targetDate);
  const [week, setWeek] = useState(() => getCurrentWeekIndex(settings.startDate, settings.targetDate));
  const energy: EnergyLevel = "normal";
  const [editingSession, setEditingSession] = useState<PlannedSession | null>(null);
  const [sessionMode, setSessionMode] = useState<PlannedSession | null>(null);
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [showProgression, setShowProgression] = useState(false);
  const variant = settings.badmintonVariant;
  const hyroxMode = isHyroxCompetitionMode(settings);
  const requestedWeek = Number(searchParams.get("week") ?? 0);
  const plannedWeek = getPlannedWeek(settings, week, variant).map((session) =>
    personalizePlannedSession(applyPlannedSessionOverride(session, getOverride(session)), settings)
  );
  const plannedTrainingWeek = plannedWeek.filter((session) => session.type !== "rest");
  const completedByPlannedId = getPlannedCompletionMap(plannedTrainingWeek, sessions);
  const weekProgramCompletion = {
    planned: plannedTrainingWeek.length,
    completed: completedByPlannedId.size,
    ratio: plannedTrainingWeek.length > 0 ? Math.round((completedByPlannedId.size / plannedTrainingWeek.length) * 100) : 0
  };
  const plannedWeekIds = plannedTrainingWeek.map((session) => session.id).join("|");
  const context = getTrainingContext(settings, week);
  const phases = buildPhases(totalWeeks);

  useEffect(() => {
    setOpenSessionId((current) => {
      if (current && plannedTrainingWeek.some((session) => session.id === current)) return current;
      return null;
    });
  }, [plannedWeekIds]);

  useEffect(() => {
    if (requestedWeek >= 1 && requestedWeek <= totalWeeks && requestedWeek !== week) {
      setWeek(requestedWeek);
    }
  }, [requestedWeek, totalWeeks, week]);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    if (!targetId) return;

    setOpenSessionId(targetId);
    window.setTimeout(() => {
      const details = document.getElementById(`${targetId}-details`);
      const card = document.getElementById(targetId);
      (details ?? card)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [location.hash, plannedWeekIds]);

  return (
    <>
      {sessionMode ? (
        <SessionMode
          session={sessionMode}
          energy={energy}
          checkedItemIds={getCheckedItemIds(sessionMode.id)}
          completed={Boolean(completedByPlannedId.get(sessionMode.id) ?? getCompletedForPlan(sessions, sessionMode))}
          onToggle={(itemId, checked) => toggleChecklistItem(sessionMode.id, itemId, checked)}
          onClose={() => setSessionMode(null)}
          onFinish={() => {
            setEditingSession(sessionMode);
            setOpenSessionId(sessionMode.id);
            setSessionMode(null);
          }}
          onUndo={() => deletePlannedSessionCompletion(sessionMode)}
        />
      ) : null}

      <PageHeader
        eyebrow="Programmes"
        title={getProgramLabel(settings)}
        description="Choisis une séance, lance-la, ajuste seulement si nécessaire."
      />

      <SectionCard className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
          <label className="field-label">
            Semaine
            <select className="field" value={week} onChange={(event) => setWeek(Number(event.target.value))}>
              {Array.from({ length: totalWeeks }, (_, index) => index + 1).map((weekNumber) => (
                <option key={weekNumber} value={weekNumber}>
                  Semaine {weekNumber}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-card border border-petrol-800/10 bg-white/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Semaine {week}</p>
                <p className="mt-1 text-sm font-bold text-muted">
                  {weekProgramCompletion.completed}/{weekProgramCompletion.planned} séance{weekProgramCompletion.planned > 1 ? "s" : ""} validée{weekProgramCompletion.completed > 1 ? "s" : ""}
                </p>
              </div>
              <p className="font-display text-3xl font-black tracking-[-0.05em] text-petrol-800">{weekProgramCompletion.ratio} %</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-limeSoft" style={{ width: `${weekProgramCompletion.ratio}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-muted">
            Les détails restent repliés pour garder la liste lisible.
          </p>
          <button type="button" className="ghost-button" onClick={() => setShowProgression((current) => !current)}>
            <ListChecks className="h-4 w-4" /> {showProgression ? "Masquer phases" : "Voir phases"}
          </button>
        </div>

        {hyroxMode ? (
          <BadmintonVariantSelector
            value={variant}
            onChange={(nextVariant) => saveSettings({ ...settings, badmintonVariant: nextVariant })}
          />
        ) : null}
      </SectionCard>

      {editingSession ? (
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Données réelles</p>
          <h2 className="title-lg mt-2">{editingSession.title}</h2>
          <div className="mt-5">
            <SessionForm
              planned={editingSession}
              initial={completedByPlannedId.get(editingSession.id) ?? getCompletedForPlan(sessions, editingSession)}
              onCancel={() => setEditingSession(null)}
              onSubmit={(session) => {
                saveSession(session);
                if (session.completed) {
                  const checklistItems = getSessionChecklist(editingSession, energy);
                  const exerciseCheckIds = getActionableExercises(editingSession.exercises).map(getExerciseCheckId);
                  saveChecklist(editingSession.id, [...checklistItems.map((item) => item.id), ...exerciseCheckIds]);
                }
                setOpenSessionId(editingSession.id);
                setEditingSession(null);
              }}
            />
          </div>
        </SectionCard>
      ) : null}

      <div className={`grid gap-5 ${showProgression ? "xl:grid-cols-[17rem_1fr]" : ""}`}>
        {showProgression ? (
          <SectionCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Progression</p>
              <button type="button" className="text-xs font-black uppercase tracking-[0.08em] text-muted" onClick={() => setShowProgression(false)}>
                Masquer
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {phases.map((phase) => (
                <div
                  key={phase.key}
                  className={`border-l-4 p-3 ${
                    week >= phase.from && week <= phase.to ? "border-petrol-800 bg-sage" : "border-petrol-800/15 bg-white"
                  }`}
                >
                  <p className="text-sm font-black text-petrol-800">{hideHyroxWhenGeneral(phase.title, settings)}</p>
                  <p className="text-xs font-bold text-muted">
                    Semaines {phase.from} à {phase.to}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <div className="grid gap-3">
          {plannedTrainingWeek.map((session, index) => {
            const completed = completedByPlannedId.get(session.id) ?? getCompletedForPlan(sessions, session);
            const inferredCompletion = Boolean(completed && !completed.plannedSessionId);
            const adapted = Boolean(getOverride(session));
            const statusLabel = completed ? (inferredCompletion ? "Reconnu" : "Fait") : adapted ? "Adaptée" : "À faire";
            const content = getDisplayedVersion(session, energy);
            const checklistItems = getSessionChecklist(session, energy).map((item) => ({
              ...item,
              group: hideHyroxWhenGeneral(item.group, settings),
              label: hideHyroxWhenGeneral(item.label, settings)
            }));
            const checkedItemIds = getCheckedItemIds(session.id);
            const hasStructuredExercises = getActionableExercises(session.exercises).length > 0;
            const isOpen = openSessionId === session.id;
            const isBadminton = session.type === "badminton";

            return (
              <article key={session.id} id={session.id} className="scroll-mt-24 panel overflow-hidden">
                <div className="flex flex-col gap-3 p-4 transition hover:bg-mist/50 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => setOpenSessionId(isOpen ? null : session.id)}
                  >
                    <span className={`flex min-w-[3.75rem] shrink-0 items-center justify-center rounded-card px-3 py-2 text-center font-display text-lg font-black leading-none ${isOpen ? "bg-petrol-800 text-limeSoft" : "bg-mist text-petrol-800"}`}>
                      #{index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-black uppercase tracking-[0.08em] text-muted">
                        {getPlannedTypeLabel(session.type, settings)} · {session.durationMin} min
                      </span>
                      <span className="mt-1 block truncate font-display text-xl font-black tracking-[-0.045em] text-petrol-800 sm:text-2xl">
                        {session.title}
                      </span>
                      {session.type !== "rest" && !isBadminton ? (
                        <span className="mt-1 block text-xs font-black text-muted">Version courte disponible</span>
                      ) : null}
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className={completed ? "chip bg-limeSoft text-petrol-900" : adapted ? "chip bg-[#24D9D2]/12 text-petrol-800" : "chip bg-white text-muted"}>
                      {statusLabel}
                    </span>
                    <span className="chip">{session.rpeTarget}</span>
                    {session.type !== "rest" ? (
                      <>
                        <button className="action-button" onClick={() => setSessionMode(session)}>
                          <PlayCircle className="h-4 w-4" /> Démarrer
                        </button>
                        {isOpen ? (
                          <button className="ghost-button" onClick={() => setEditingSession(session)}>
                            <Pencil className="h-4 w-4" /> Modifier
                          </button>
                        ) : (
                          <button className="ghost-button" onClick={() => setOpenSessionId(session.id)}>
                            <ChevronDown className="h-4 w-4" /> Détails
                          </button>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

                {isOpen ? (
                  <div id={`${session.id}-details`} className="scroll-mt-24 border-t border-petrol-800/10 p-4 sm:p-5">
                  {completed ? (
                    <div className="mb-4 border-l-4 border-limeSoft bg-limeSoft/20 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
                        Séance faite{inferredCompletion ? " · reconnue depuis une saisie libre" : ""}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-ink">
                        {completed.title} · {completed.durationMin} min{completed.rpe ? ` · RPE ${completed.rpe}` : ""}
                      </p>
                    </div>
                  ) : null}
                  <div className="border-l-4 border-limeSoft bg-mist/45 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-petrol-800">{isBadminton ? "Suivi" : "Objectif"}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink">{session.objective}</p>
                  </div>

                  {!isBadminton && !hasStructuredExercises ? (
                    <p className="mt-4 bg-white p-4 text-sm font-semibold leading-6 text-ink">{content}</p>
                  ) : null}

                  {!isBadminton ? (
                    <>
                      <ExercisePrescriptionPanel
                        exercises={session.exercises}
                        energy={energy}
                        checkedItemIds={checkedItemIds}
                        onToggle={(itemId, checked) => toggleChecklistItem(session.id, itemId, checked)}
                      />

                      <SessionChecklistPanel
                        items={checklistItems}
                        checkedItemIds={checkedItemIds}
                        onToggle={(itemId, checked) => toggleChecklistItem(session.id, itemId, checked)}
                        onCheckAll={() =>
                          saveChecklist(session.id, [
                            ...checkedItemIds.filter((itemId) => itemId.startsWith("exercise:")),
                            ...checklistItems.map((item) => item.id)
                          ])
                        }
                        onReset={() => saveChecklist(session.id, checkedItemIds.filter((itemId) => itemId.startsWith("exercise:")))}
                      />
                    </>
                  ) : null}

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {!isBadminton ? (
                      <div className="flex flex-wrap gap-2">
                      {context.vacation ? <span className="chip bg-limeSoft">Vacances</span> : null}
                      {session.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                      </div>
                    ) : (
                      <span />
                    )}
                    {session.type !== "rest" && completed ? (
                      <button
                        className="ghost-button"
                        onClick={() => {
                          if (completed.plannedSessionId) {
                            deletePlannedSessionCompletion(session);
                          } else {
                            deleteSession(completed.id);
                          }
                        }}
                      >
                        <RotateCcw className="h-4 w-4" /> Annuler réalisé
                      </button>
                    ) : null}
                  </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
