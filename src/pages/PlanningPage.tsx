import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, ListChecks, Pencil, PlayCircle, RotateCcw, StickyNote } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { BadmintonVariantSelector } from "../components/planning/BadmintonVariantSelector";
import { SessionMode } from "../components/session/SessionMode";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { ENERGY_LEVELS } from "../data/defaults";
import { buildPhases } from "../data/phases";
import { getSessionChecklist } from "../data/sessionChecklists";
import { getDisplayedVersion, getPlannedWeek, getTrainingContext } from "../data/trainingPlan";
import { applyPlannedSessionOverride, usePlanningOverrides } from "../hooks/usePlanningOverrides";
import { useSessionChecklists } from "../hooks/useSessionChecklists";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import type { EnergyLevel, ExercisePrescription, PlannedSession, SessionChecklistItem } from "../types";
import { formatShortDate, getCurrentWeekIndex, getTotalWeeks, getWeekEnd, getWeekStart } from "../utils/dates";
import {
  getActionableExercises,
  getExerciseCheckId,
  getExerciseDetailChips,
  getExerciseDisplayTitle,
  getExerciseInstruction,
  getGuidanceExercises
} from "../utils/exerciseDisplay";
import { getCompletedForPlan, getPlannedCompletion } from "../utils/training";
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

type PlanningSessionStatus = "prévue" | "faite" | "adaptée" | "sautée";

const planningStatusClasses: Record<PlanningSessionStatus, string> = {
  prévue: "bg-white text-petrol-800",
  faite: "bg-limeSoft text-petrol-900",
  adaptée: "bg-amber-100 text-amber-950",
  sautée: "bg-red-50 text-red-950"
};

function getPlanningSessionStatus({
  session,
  completed,
  energy,
  note
}: {
  session: PlannedSession;
  completed: boolean;
  energy: EnergyLevel;
  note?: string;
}): PlanningSessionStatus {
  if (completed) return "faite";
  if (session.type !== "rest" && (energy !== "normal" || Boolean(note?.trim()))) return "adaptée";
  return "prévue";
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
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-petrol-800">{group.group}</p>
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
          <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-petrol-800">Prépa / consignes</p>
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
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted">{exercise.block}</p>
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
          Rien à cocher ici : cette séance sert surtout à récupérer, préparer ou noter les sensations.
        </p>
      ) : null}
    </details>
  );
}

function SessionCommentBox({
  sessionId,
  note,
  onSave,
  onReset
}: {
  sessionId: string;
  note: string;
  onSave: (note: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(note);
    setSaved(false);
  }, [note, sessionId]);

  useEffect(() => {
    if (draft === note) return;

    setSaved(false);
    const timeout = window.setTimeout(() => {
      onSave(draft);
      setSaved(true);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [draft, note, onSave]);

  return (
    <div className="mt-4 border border-petrol-800/10 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-petrol-800 text-limeSoft">
            <StickyNote className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Commentaire planning</p>
            <p className="text-xs font-bold text-muted">Sauvegarde automatique, pratique pour charges, douleurs, adaptations.</p>
          </div>
        </div>
        {note ? (
          <button type="button" className="ghost-button" onClick={onReset}>
            Effacer
          </button>
        ) : null}
      </div>
      <textarea
        className="textarea-field mt-3 min-h-24"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Ex : Sled Push trop lourd, garder 80 % calibration. Genou OK. Prévoir plus de repos avant wall balls..."
      />
      <p className="mt-2 text-xs font-bold text-muted">
        {draft !== note ? "Sauvegarde en cours..." : saved ? "Commentaire sauvegardé." : "Le commentaire reste lié à cette séance du planning."}
      </p>
    </div>
  );
}

export default function PlanningPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { settings, saveSettings } = useSettings();
  const { sessions, saveSession, deletePlannedSessionCompletion } = useSessions();
  const { getCheckedItemIds, saveChecklist, toggleChecklistItem } = useSessionChecklists();
  const { getOverride, saveNotes, resetOverride } = usePlanningOverrides();
  const totalWeeks = getTotalWeeks(settings.startDate, settings.targetDate);
  const [week, setWeek] = useState(() => getCurrentWeekIndex(settings.startDate, settings.targetDate));
  const [energy, setEnergy] = useState<EnergyLevel>("normal");
  const [editingSession, setEditingSession] = useState<PlannedSession | null>(null);
  const [sessionMode, setSessionMode] = useState<PlannedSession | null>(null);
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [showProgression, setShowProgression] = useState(false);
  const variant = settings.badmintonVariant;
  const hyroxMode = isHyroxCompetitionMode(settings);
  const requestedWeek = Number(searchParams.get("week") ?? 0);
  const plannedWeek = getPlannedWeek(settings, week, variant).map((session) =>
    personalizePlannedSession(applyPlannedSessionOverride(session, getOverride(session.id)), settings)
  );
  const plannedTrainingWeek = plannedWeek.filter((session) => session.type !== "rest");
  const weekProgramCompletion = getPlannedCompletion(plannedTrainingWeek, sessions);
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
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [location.hash, plannedWeekIds]);

  return (
    <>
      {sessionMode ? (
        <SessionMode
          session={sessionMode}
          energy={energy}
          checkedItemIds={getCheckedItemIds(sessionMode.id)}
          completed={Boolean(getCompletedForPlan(sessions, sessionMode.id))}
          onToggle={(itemId, checked) => toggleChecklistItem(sessionMode.id, itemId, checked)}
          onClose={() => setSessionMode(null)}
          onFinish={() => {
            setEditingSession(sessionMode);
            setOpenSessionId(sessionMode.id);
            setSessionMode(null);
          }}
          onUndo={() => deletePlannedSessionCompletion(sessionMode.id)}
        />
      ) : null}

      <PageHeader
        eyebrow="Programmes"
        title={getProgramLabel(settings)}
        description={
          hyroxMode
            ? "Mode compétition spécialisé : la semaine devient une liste de séances à choisir selon tes contraintes, pas un agenda rigide."
            : "Mode général : prépare tes séances de la semaine, puis choisis chaque jour celle qui colle à ta vraie vie."
        }
      />

      <SectionCard className="p-5 sm:p-6">
        <div className={`grid gap-3 ${hyroxMode ? "lg:grid-cols-2" : "lg:grid-cols-[0.8fr_1.45fr_0.75fr]"}`}>
          <label className="field-label">
            Semaine
            <select className="field" value={week} onChange={(event) => setWeek(Number(event.target.value))}>
              {Array.from({ length: totalWeeks }, (_, index) => index + 1).map((weekNumber) => (
                <option key={weekNumber} value={weekNumber}>
                  Semaine {weekNumber} - {formatShortDate(getWeekStart(settings.startDate, weekNumber))} au{" "}
                  {formatShortDate(getWeekEnd(settings.startDate, weekNumber))}
                </option>
              ))}
            </select>
          </label>

          {!hyroxMode ? (
            <div className="field-label">
              Organisation
              <div className="field flex items-center text-sm font-black text-muted">Planning adapté aux modules et au niveau choisis.</div>
            </div>
          ) : null}

          <label className="field-label">
            État
            <select className="field" value={energy} onChange={(event) => setEnergy(event.target.value as EnergyLevel)}>
              {ENERGY_LEVELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 border border-petrol-800/10 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Séances de la semaine</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted">
                Elles ne sont pas verrouillées par jour : tu choisis la séance du moment depuis l'accueil.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-3xl font-black tracking-[-0.05em] text-petrol-800">
                {weekProgramCompletion.completed}/{weekProgramCompletion.planned} · {weekProgramCompletion.ratio} %
              </p>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">validées</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden bg-mist">
            <div className="h-full bg-limeSoft" style={{ width: `${weekProgramCompletion.ratio}%` }} />
          </div>
        </div>

        {hyroxMode ? (
          <BadmintonVariantSelector
            value={variant}
            onChange={(nextVariant) => saveSettings({ ...settings, badmintonVariant: nextVariant })}
          />
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="bg-mist/70 p-4">
            <p className="eyebrow">Phase</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{hideHyroxWhenGeneral(context.phase.title, settings)}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">{hideHyroxWhenGeneral(context.phase.summary, settings)}</p>
          </div>
          <div className="bg-white p-4">
            <p className="eyebrow">Période</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">
              {formatShortDate(getWeekStart(settings.startDate, week))} - {formatShortDate(getWeekEnd(settings.startDate, week))}
            </h2>
            <p className="mt-2 text-sm font-semibold text-muted">
              {context.deload ? "Semaine allégée planifiée." : "Semaine de charge progressive."}
            </p>
          </div>
          <div className="bg-limeSoft p-4 text-petrol-900">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em]">Vacances</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.05em]">
              {context.vacation ? "Mode maintenance" : "Semaine normale"}
            </h2>
            <p className="mt-2 text-sm font-bold opacity-75">
              Configure les semaines de vacances dans Réglages pour réduire automatiquement la charge.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-petrol-800/10 pt-4">
          <p className="text-xs font-bold text-muted">
            La progression par phases est optionnelle : garde-la cachée pour un planning plus lisible.
          </p>
          <button type="button" className="ghost-button" onClick={() => setShowProgression((current) => !current)}>
            <ListChecks className="h-4 w-4" /> {showProgression ? "Masquer progression" : "Afficher progression"}
          </button>
        </div>
      </SectionCard>

      {editingSession ? (
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Données réelles</p>
          <h2 className="title-lg mt-2">{editingSession.title}</h2>
          <div className="mt-5">
            <SessionForm
              planned={editingSession}
              initial={getCompletedForPlan(sessions, editingSession.id)}
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
            const completed = getCompletedForPlan(sessions, session.id);
            const content = getDisplayedVersion(session, energy);
            const checklistItems = getSessionChecklist(session, energy).map((item) => ({
              ...item,
              group: hideHyroxWhenGeneral(item.group, settings),
              label: hideHyroxWhenGeneral(item.label, settings)
            }));
            const checkedItemIds = getCheckedItemIds(session.id);
            const hasStructuredExercises = getActionableExercises(session.exercises).length > 0;
            const override = getOverride(session.id);
            const isOpen = openSessionId === session.id;
            const status = getPlanningSessionStatus({
              session,
              completed: Boolean(completed),
              energy,
              note: override?.notes
            });

            return (
              <article key={session.id} id={session.id} className="scroll-mt-24 panel overflow-hidden">
                <div className="flex flex-col gap-3 p-4 transition hover:bg-mist/50 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => setOpenSessionId(isOpen ? null : session.id)}
                  >
                    <span className={`flex min-w-[4.75rem] shrink-0 items-center justify-center px-3 py-2 text-center font-display text-lg font-black leading-none ${isOpen ? "bg-petrol-800 text-limeSoft" : "bg-mist text-petrol-800"}`}>
                      #{index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted">
                        {getPlannedTypeLabel(session.type, settings)} · repère initial {session.day} {formatShortDate(session.date)}
                      </span>
                      <span className="mt-1 block truncate font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">
                        {session.title}
                      </span>
                      {session.type !== "rest" ? (
                        <span className="mt-2 block text-xs font-black text-muted">
                          {energy === "fatigue" ? "Version courte active" : "Si fatigue : version courte disponible"}
                        </span>
                      ) : null}
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className={`chip ${planningStatusClasses[status]}`}>Statut : {status}</span>
                    <span className="chip">{session.durationMin} min</span>
                    <span className="chip">{session.rpeTarget}</span>
                    {session.type !== "rest" ? (
                      <>
                        <button className="action-button" onClick={() => setSessionMode(session)}>
                          <PlayCircle className="h-4 w-4" /> Démarrer
                        </button>
                        <button className="ghost-button" onClick={() => setEditingSession(session)}>
                          <Pencil className="h-4 w-4" /> Modifier
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      className="ghost-button px-3"
                      onClick={() => setOpenSessionId(isOpen ? null : session.id)}
                      aria-label={isOpen ? "Replier la séance" : "Développer la séance"}
                    >
                      <ChevronDown className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="border-t border-petrol-800/10 p-4 sm:p-5">
                  <div className="border-l-4 border-limeSoft bg-mist/45 p-4">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-petrol-800">Objectif</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink">{session.objective}</p>
                  </div>

                  {!hasStructuredExercises || energy !== "normal" ? (
                    <p className="mt-4 bg-white p-4 text-sm font-semibold leading-6 text-ink">{content}</p>
                  ) : (
                    <p className="mt-4 border border-petrol-800/10 bg-white p-3 text-xs font-bold leading-5 text-muted">
                      La prescription est structurée ci-dessous pour éviter les doublons : tu coches uniquement les blocs utiles et tu notes charge, ressenti ou adaptation.
                    </p>
                  )}
                  {session.type !== "rest" ? (
                    <p className="mt-3 border border-petrol-800/10 bg-white p-3 text-xs font-bold leading-5 text-muted">
                      Après la séance, utilise “Saisir temps / FC / calories” : durée, FC, calories et RPE alimentent directement les stats.
                    </p>
                  ) : null}

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

                  <SessionCommentBox
                    sessionId={session.id}
                    note={override?.notes ?? ""}
                    onSave={(note) => saveNotes(session, note)}
                    onReset={() => resetOverride(session.id)}
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {context.deload ? <span className="chip bg-amber-100">Semaine allégée</span> : null}
                      {context.vacation ? <span className="chip bg-limeSoft">Vacances</span> : null}
                      {session.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {session.type !== "rest" ? (
                      <div className="flex flex-wrap gap-2">
                        <button className="action-button" onClick={() => setSessionMode(session)}>
                          <PlayCircle className="h-4 w-4" /> Démarrer
                        </button>
                        <button className="ghost-button" onClick={() => setEditingSession(session)}>
                          <Pencil className="h-4 w-4" /> Modifier
                        </button>
                        {completed ? (
                          <button className="ghost-button" onClick={() => deletePlannedSessionCompletion(session.id)}>
                            <RotateCcw className="h-4 w-4" /> Annuler réalisé
                          </button>
                        ) : null}
                      </div>
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
