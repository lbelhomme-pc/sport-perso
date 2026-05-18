import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Edit3, Plus, Trash2, Dumbbell } from "lucide-react";
import { SessionForm } from "../components/forms/SessionForm";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import { makeId } from "../services/storageService";
import type { CompletedSession, CompletedSessionType, SportType } from "../types";
import { estimateCaloriesFromSession } from "../utils/calories";
import { formatLongDate, toISODate } from "../utils/dates";
import { energyFromFatigueScore, hasMeaningfulPain } from "../utils/readiness";
import { formatSessionDetails } from "../utils/sessionDetails";
import { getCompletedTypeLabel, isHyroxCompetitionMode } from "../utils/sportLabels";
import { getAverageHeartRate, getAverageRpe } from "../utils/training";

const fallbackSessionTypes: CompletedSessionType[] = [
  "strength",
  "run",
  "badminton",
  "racket",
  "hybrid",
  "bike",
  "swim",
  "mobility",
  "hyrox",
  "recovery",
  "test",
  "free",
  "other"
];

function toCompletedSessionType(sport: SportType): CompletedSessionType {
  return sport;
}

function buildVisibleSessionTypes(enabledSports: SportType[] | undefined, sessions: CompletedSession[], hyroxMode: boolean) {
  const selectedSports = enabledSports?.length ? enabledSports.map(toCompletedSessionType) : [];
  const baseTypes = hyroxMode ? fallbackSessionTypes : fallbackSessionTypes.filter((type) => type !== "hyrox");
  const normalizedSports = selectedSports.map((type) => (!hyroxMode && type === "hyrox" ? "hybrid" : type));
  const alreadyUsed = sessions.map((session) => session.type);
  return Array.from(new Set<CompletedSessionType>([...baseTypes, ...normalizedSports, ...alreadyUsed]));
}

function QuickSessionForm({
  date,
  typeOptions,
  onSubmit,
  onDetailed,
  getTypeLabel
}: {
  date: string;
  typeOptions: CompletedSessionType[];
  onSubmit: (session: CompletedSession) => void;
  onDetailed: () => void;
  getTypeLabel: (type: CompletedSessionType) => string;
}) {
  const defaultType = typeOptions.includes("strength") ? "strength" : typeOptions[0] ?? "free";
  const [form, setForm] = useState({
    date,
    type: defaultType as CompletedSessionType,
    durationMin: "45",
    rpe: "",
    fatigueDuring: "",
    painDuring: "",
    notes: ""
  });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    const durationMin = Math.max(0, Number(form.durationMin || 0));
    const rpe = form.rpe ? Number(form.rpe) : undefined;
    const fatigueDuring = form.fatigueDuring ? Number(form.fatigueDuring) : undefined;
    const painDuring = form.painDuring ? Number(form.painDuring) : undefined;
    onSubmit({
      id: makeId("session"),
      date: form.date,
      type: form.type,
      title: getTypeLabel(form.type),
      durationMin,
      caloriesBurned: estimateCaloriesFromSession(form.type, durationMin),
      rpe,
      difficulty: rpe !== undefined && rpe >= 8 ? "hard" : rpe !== undefined && rpe <= 4 ? "easy" : "ok",
      pain: hasMeaningfulPain(painDuring),
      painDuring,
      fatigueDuring,
      energyAfter: fatigueDuring !== undefined ? energyFromFatigueScore(fatigueDuring) : "normal",
      notes: form.notes || undefined,
      completed: true
    });
  };

  return (
    <div className="grid gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft">
      <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
        Saisie rapide : type, durée, RPE et douleur suffisent. Tu pourras corriger plus tard si besoin.
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="field-label">
          Date
          <input className="field" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label className="field-label">
          Type
          <select className="field" value={form.type} onChange={(event) => update("type", event.target.value as CompletedSessionType)}>
            {typeOptions.map((value) => (
              <option key={value} value={value}>
                {getTypeLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Durée
          <input className="field" type="number" min="0" inputMode="numeric" value={form.durationMin} onChange={(event) => update("durationMin", event.target.value)} />
        </label>
        <label className="field-label">
          RPE / 10
          <input className="field" type="number" min="0" max="10" inputMode="numeric" value={form.rpe} onChange={(event) => update("rpe", event.target.value)} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr]">
        <label className="field-label">
          Fatigue pendant / 10
          <input className="field" type="number" min="0" max="10" inputMode="numeric" value={form.fatigueDuring} onChange={(event) => update("fatigueDuring", event.target.value)} placeholder="0-10" />
        </label>
        <label className="field-label">
          Douleur pendant / 10
          <input className="field" type="number" min="0" max="10" inputMode="numeric" value={form.painDuring} onChange={(event) => update("painDuring", event.target.value)} placeholder="0-10" />
        </label>
        <label className="field-label">
          Note facultative
          <input className="field" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ex : jambes lourdes, bon cardio..." />
        </label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="ghost-button" onClick={onDetailed}>
          Saisie détaillée
        </button>
        <button type="button" className="action-button" onClick={save}>
          <Plus className="h-4 w-4" /> Enregistrer rapide
        </button>
      </div>
    </div>
  );
}

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
  const { settings } = useSettings();
  const hyroxMode = isHyroxCompetitionMode(settings);
  const getTypeLabel = (type: CompletedSessionType) => getCompletedTypeLabel(type, settings);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDate = searchParams.get("date");
  const initialSessionDate = queryDate && /^\d{4}-\d{2}-\d{2}$/.test(queryDate) ? queryDate : toISODate(new Date());
  const shouldOpenFromQuery = searchParams.get("add") === "1";
  const [filter, setFilter] = useState<CompletedSessionType | "all">("all");
  const [editing, setEditing] = useState<CompletedSession | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [detailedForm, setDetailedForm] = useState(false);
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const sessionTypeOptions = useMemo(
    () => buildVisibleSessionTypes(settings.enabledSports, sessions, hyroxMode),
    [settings.enabledSports, sessions, hyroxMode]
  );
  const filters: Array<CompletedSessionType | "all"> = useMemo(() => ["all", ...sessionTypeOptions], [sessionTypeOptions]);
  const orderedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [sessions]
  );
  const displayedSessions = filter === "all" ? orderedSessions : orderedSessions.filter((session) => session.type === filter);
  const totalCalories = sessions.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const totalVolume = sessions.reduce((total, session) => total + session.durationMin, 0);
  const averageRpe = getAverageRpe(sessions);
  const summaryStats = [
    { label: "Séances", value: sessions.length, hint: "Total" },
    { label: "Volume", value: totalVolume.toLocaleString("fr-FR"), hint: "min" },
    { label: "Calories", value: totalCalories.toLocaleString("fr-FR"), hint: "sport kcal" },
    { label: "RPE", value: averageRpe || "—", hint: "moyen" }
  ];

  useEffect(() => {
    if (shouldOpenFromQuery) {
      setShowForm(true);
      setDetailedForm(false);
    }
  }, [shouldOpenFromQuery]);

  useEffect(() => {
    if (!filters.includes(filter)) {
      setFilter("all");
    }
  }, [filter, filters]);

  useEffect(() => {
    if (!showForm) return;

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [detailedForm, showForm]);

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setDetailedForm(false);
    if (searchParams.has("add")) {
      const next = new URLSearchParams(searchParams);
      next.delete("add");
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Historique"
        title="Séances"
        description="Historique complet, ajout rapide et modification directe."
        action={
          <button
            className="action-button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
              setDetailedForm(false);
            }}
          >
            <Plus className="h-4 w-4" /> Ajouter une séance
          </button>
        }
      />

      <section className="rounded-panel border border-petrol-800/10 bg-white/90 p-2 shadow-soft">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="min-w-0 rounded-card bg-mist/55 px-2 py-2">
              <p className="truncate text-[0.52rem] font-black uppercase tracking-[0.07em] text-muted sm:text-[0.6rem]">{stat.label}</p>
              <p className="mt-1 truncate font-display text-xl font-black tracking-[-0.05em] text-petrol-800 sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 truncate text-[0.55rem] font-bold text-muted sm:text-[0.65rem]">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {showForm ? (
        <div ref={formRef}>
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Ajouter</p>
          <h2 className="title-lg mt-2">Nouvelle séance</h2>
          <div className="mt-5">
            {detailedForm ? (
              <SessionForm
                initial={{ date: initialSessionDate }}
                typeOptions={sessionTypeOptions}
                getTypeLabel={getTypeLabel}
                onCancel={closeForm}
                onSubmit={(session) => {
                  saveSession(session);
                  setSaveMessage("Séance enregistrée. Prochaine décision : récupération ou séance suivante.");
                  closeForm();
                }}
              />
            ) : (
              <QuickSessionForm
                key={initialSessionDate}
                date={initialSessionDate}
                typeOptions={sessionTypeOptions}
                getTypeLabel={getTypeLabel}
                onDetailed={() => setDetailedForm(true)}
                onSubmit={(session) => {
                  saveSession(session);
                  setSaveMessage("Séance enregistrée. Prochaine décision : récupération ou séance suivante.");
                  closeForm();
                }}
              />
            )}
          </div>
        </SectionCard>
        </div>
      ) : null}

      {saveMessage ? (
        <SectionCard className="border-l-4 border-limeSoft p-4 text-sm font-black text-petrol-800">
          {saveMessage}
        </SectionCard>
      ) : null}

      <SectionCard className="p-5 sm:p-6">
        <label className="field-label max-w-md">
          Filtre
          <select className="field" value={filter} onChange={(event) => setFilter(event.target.value as CompletedSessionType | "all")}>
            {filters.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Toutes les séances" : getTypeLabel(item)}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 grid gap-3">
          {displayedSessions.length ? (
            displayedSessions.map((session) => {
              const isOpen = openSessionId === session.id;
              const isEditing = editing?.id === session.id;
              const detailRows = formatSessionDetails(session.type, session.sessionDetails);

              return (
              <article key={session.id} className="border border-petrol-800/10 bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => setOpenSessionId(isOpen ? null : session.id)}
                  >
                    <p className="eyebrow">{formatLongDate(session.date)}</p>
                    <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{session.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">{getTypeLabel(session.type)}</span>
                      <span className="chip">{session.durationMin} min</span>
                      {session.caloriesBurned ? <span className="chip">{session.caloriesBurned} kcal</span> : null}
                      {session.rpe ? <span className="chip">RPE {session.rpe}</span> : null}
                      {session.fatigueDuring !== undefined ? <span className="chip">Fatigue {session.fatigueDuring}/10</span> : null}
                      {session.painDuring !== undefined ? <span className="chip">Douleur {session.painDuring}/10</span> : null}
                      <span className="chip bg-white">{isOpen ? "Détails ouverts" : "Voir détails"}</span>
                    </div>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button className="ghost-button" onClick={() => setOpenSessionId(isOpen ? null : session.id)} aria-label={isOpen ? "Replier la séance" : "Développer la séance"}>
                      <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        setEditing(isEditing ? null : session);
                        setOpenSessionId(session.id);
                        setShowForm(false);
                      }}
                      aria-label="Modifier la séance"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        if (window.confirm("Supprimer cette séance ?")) deleteSession(session.id);
                      }}
                      aria-label="Supprimer la séance"
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                </div>

                {isEditing ? (
                <div className="mt-4 border-t border-petrol-800/10 pt-4">
                  <SessionForm
                    initial={session}
                    typeOptions={sessionTypeOptions}
                    getTypeLabel={getTypeLabel}
                    onCancel={() => setEditing(null)}
                    onSubmit={(updatedSession) => {
                      saveSession(updatedSession);
                      setSaveMessage("Séance enregistrée.");
                      setEditing(null);
                      setOpenSessionId(updatedSession.id);
                    }}
                  />
                </div>
                ) : isOpen ? (
                <div className="mt-4 border-t border-petrol-800/10 pt-4">
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricCard label="FC moyenne" value={session.averageHeartRate ?? "—"} />
                  <MetricCard label="FC max" value={session.maxHeartRate ?? "—"} />
                  <MetricCard label="FC moy. filtre" value={getAverageHeartRate([session]) || "—"} />
                </div>

                {detailRows.length ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {detailRows.map((detail) => (
                      <div key={detail.label} className="rounded-card border border-petrol-800/10 bg-mist/45 p-3">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-muted">{detail.label}</p>
                        <p className="mt-1 text-sm font-black text-petrol-800">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {session.notes ? (
                  <p className="mt-4 whitespace-pre-line border-l-4 border-limeSoft bg-mist/50 p-4 text-sm font-semibold text-ink">
                    {session.notes}
                  </p>
                ) : null}
                <CompletedExercisesList session={session} />
                </div>
                ) : null}
              </article>
              );
            })
          ) : (
            <EmptyState icon={Dumbbell} title="Aucune séance" message="Ajoute une séance ou change le filtre." />
          )}
        </div>
      </SectionCard>
    </>
  );
}
