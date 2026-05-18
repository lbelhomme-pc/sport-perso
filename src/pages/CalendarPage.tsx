import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MealForm } from "../components/forms/MealForm";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { MEAL_TYPE_LABELS } from "../data/defaults";
import { getPlannedWeek } from "../data/trainingPlan";
import { useMeals } from "../hooks/useMeals";
import { useSettings } from "../hooks/useSettings";
import { useStoredData } from "../hooks/useStoredData";
import { useUserModules } from "../hooks/useUserModules";
import type { CompletedSessionType, PlannedSessionType } from "../types";
import { getTotalWeeks, getWeekIndexForDate, toISODate } from "../utils/dates";
import { tracksNutritionNumbers } from "../utils/nutritionMode";
import { getCompletedTypeLabel, getPlannedTypeLabel, isHyroxCompetitionMode, personalizePlannedSession } from "../utils/sportLabels";

type CalendarViewMode = "agenda" | "compact" | "grid";

const CALENDAR_VIEW_KEY = "sport-progress-tracker:calendar-view:v1";
const CALENDAR_VIEWS: Array<{ id: CalendarViewMode; label: string; hint: string }> = [
  { id: "agenda", label: "Agenda", hint: "liste lisible" },
  { id: "compact", label: "Compact", hint: "mois mobile" },
  { id: "grid", label: "Détaillé", hint: "grille large" }
];

const PLANNED_SHORT_LABELS: Record<PlannedSessionType, string> = {
  rest: "Repos",
  badminton: "Bad",
  racket: "Raq",
  strength: "Salle",
  run: "Card.",
  bike: "Vélo",
  swim: "Nage",
  hybrid: "Hybr",
  hyrox: "HY",
  mobility: "Mob",
  recovery: "Rec",
  test: "Test",
  free: "Libre"
};
const SESSION_SHORT_LABELS: Record<CompletedSessionType, string> = {
  badminton: "Bad",
  racket: "Raq",
  strength: "Salle",
  run: "Card.",
  bike: "Vélo",
  swim: "Nage",
  hybrid: "Hybr",
  hyrox: "HY",
  mobility: "Mob",
  recovery: "Rec",
  test: "Test",
  free: "Libre",
  other: "Autre"
};

function readInitialCalendarView(): CalendarViewMode {
  if (typeof window === "undefined") return "agenda";
  const saved = window.localStorage.getItem(CALENDAR_VIEW_KEY);
  return saved === "agenda" || saved === "compact" || saved === "grid" ? saved : "agenda";
}

export default function CalendarPage() {
  const { settings } = useSettings();
  const hyroxMode = isHyroxCompetitionMode(settings);
  const { isEnabled } = useUserModules();
  const showSport = isEnabled("training") || isEnabled("sessions");
  const showNutrition = isEnabled("nutrition");
  const showNutritionNumbers = showNutrition && tracksNutritionNumbers(settings);
  const plannedLabel = (type: PlannedSessionType) => getPlannedTypeLabel(type, settings);
  const sessionLabel = (type: CompletedSessionType) => getCompletedTypeLabel(type, settings);
  const plannedShortLabel = (type: PlannedSessionType) => (!hyroxMode && type === "hyrox" ? "Hybr" : PLANNED_SHORT_LABELS[type]);
  const sessionShortLabel = (type: CompletedSessionType) => (!hyroxMode && type === "hyrox" ? "Hybr" : SESSION_SHORT_LABELS[type]);
  const { saveMeal } = useMeals();
  const data = useStoredData();
  const today = toISODate(new Date());
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showMealForm, setShowMealForm] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(readInitialCalendarView);
  const mealFormRef = useRef<HTMLDivElement>(null);
  const totalWeeks = getTotalWeeks(settings.startDate, settings.targetDate);
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 1 })
  });
  const weekIndexes = [
    ...new Set(
      calendarDays
        .map((day) => {
          const isoDate = toISODate(day);
          return isoDate >= settings.startDate && isoDate <= settings.targetDate
            ? getWeekIndexForDate(settings.startDate, settings.targetDate, isoDate)
            : null;
        })
        .filter((week): week is number => typeof week === "number" && week >= 1 && week <= totalWeeks)
    )
  ];
  const plannedSessions = weekIndexes.flatMap((week) =>
    getPlannedWeek(settings, week, settings.badmintonVariant).map((session) => personalizePlannedSession(session, settings))
  );
  const selectedCompletedSessions = showSport ? data.sessions.filter((session) => session.date === selectedDate && session.completed) : [];
  const selectedPlannedSessions = showSport ? plannedSessions.filter((session) => session.date === selectedDate && session.type !== "rest") : [];
  const selectedMeals = showNutrition ? data.meals.filter((meal) => meal.date === selectedDate) : [];
  const selectedSummary = [
    showSport ? `${selectedPlannedSessions.length} prévu` : null,
    showSport ? `${selectedCompletedSessions.length} fait` : null,
    showNutrition ? `${selectedMeals.length} repas` : null
  ]
    .filter((item): item is string => Boolean(item))
    .join(" · ");

  const selectDay = (day: Date) => {
    setMonth(day);
    setSelectedDate(toISODate(day));
  };

  const getDayInfo = (day: Date) => {
    const isoDate = toISODate(day);
    const completedSessions = showSport ? data.sessions.filter((session) => session.date === isoDate && session.completed) : [];
    const plannedForDay = showSport ? plannedSessions.filter((session) => session.date === isoDate && session.type !== "rest") : [];
    const mealsForDay = showNutrition ? data.meals.filter((meal) => meal.date === isoDate) : [];
    const movementForDay = data.dailyContexts.find((context) => context.date === isoDate);
    const hasMovement = Boolean((movementForDay?.steps ?? 0) > 0 || (movementForDay?.floors ?? 0) > 0);
    const selected = isoDate === selectedDate;
    const hasContent = plannedForDay.length || completedSessions.length || mealsForDay.length || hasMovement;

    return {
      isoDate,
      completedSessions,
      plannedForDay,
      mealsForDay,
      movementForDay,
      selected,
      hasContent
    };
  };

  useEffect(() => {
    if (!showMealForm) return;

    window.setTimeout(() => {
      mealFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [selectedDate, showMealForm]);

  useEffect(() => {
    window.localStorage.setItem(CALENDAR_VIEW_KEY, viewMode);
  }, [viewMode]);

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title={showSport ? "Jours et séances" : showNutrition ? "Jours, repas et mouvement" : "Jours et mouvement"}
        description={
          showSport && showNutrition
            ? "Une vue simple pour voir les séances prévues, les repas et ce que tu as réellement fait."
            : showSport
              ? "Une vue simple pour voir les séances prévues et ce que tu as réellement fait."
              : showNutrition
                ? "Une vue simple pour voir les repas et ton mouvement quotidien."
                : "Une vue simple pour voir ton mouvement quotidien."
        }
      />

      <SectionCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Mois affiché</p>
            <h2 className="title-lg mt-2 capitalize">{format(month, "MMMM yyyy", { locale: fr })}</h2>
          </div>
          <div className="grid w-full min-w-0 grid-cols-3 gap-2 sm:w-auto">
            <button type="button" className="ghost-button min-w-0 px-3" onClick={() => setMonth((current) => subMonths(current, 1))}>
              <ChevronLeft className="h-4 w-4" /> Préc.
            </button>
            <button
              type="button"
              className="action-button min-w-0 px-3"
              onClick={() => {
                const now = new Date();
                setMonth(now);
                setSelectedDate(toISODate(now));
              }}
            >
              Aujourd'hui
            </button>
            <button type="button" className="ghost-button min-w-0 px-3" onClick={() => setMonth((current) => addMonths(current, 1))}>
              Suiv. <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={`mt-5 grid gap-3 rounded-none border border-petrol-800/10 bg-mist/45 p-4 ${showSport || showNutrition ? "lg:grid-cols-[0.85fr_1.15fr]" : ""}`}>
          <div className="bg-petrol-800 p-4 text-white">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Jour sélectionné</p>
            <h2 className="mt-2 font-display text-3xl font-black capitalize tracking-[-0.06em]">
              {format(parseISO(selectedDate), "EEEE d MMMM", { locale: fr })}
            </h2>
            <p className="mt-2 text-sm font-bold text-white/70">{selectedSummary || "Rien à afficher pour ce choix"}</p>
            {showNutrition ? (
              <button
                type="button"
                className="mt-4 w-full action-button bg-limeSoft text-petrol-900 hover:bg-white"
                onClick={() => setShowMealForm(true)}
              >
                <Plus className="h-4 w-4" /> Ajouter un repas ce jour
              </button>
            ) : null}
          </div>

          {showSport || showNutrition ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {showSport ? (
            <div className="border border-petrol-800/10 bg-white p-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Sport</p>
              <div className="mt-2 grid gap-2">
                {selectedPlannedSessions.length ? (
                  selectedPlannedSessions.map((session) => (
                    <p key={session.id} className="border-l-4 border-petrol-800 bg-mist/60 px-3 py-2 text-sm font-black text-petrol-800">
                      Prévu : {plannedLabel(session.type)} · {session.durationMin} min
                    </p>
                  ))
                ) : (
                  <p className="text-sm font-bold text-muted">Aucune séance prévue.</p>
                )}
                {selectedCompletedSessions.map((session) => (
                  <p key={session.id} className="border-l-4 border-limeSoft bg-petrol-800 px-3 py-2 text-sm font-black text-white">
                    Fait : {sessionLabel(session.type)} · {session.durationMin} min
                  </p>
                ))}
              </div>
            </div>
            ) : null}

            {showNutrition ? (
              <div className="border border-petrol-800/10 bg-white p-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Repas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMeals.length ? (
                    selectedMeals.map((meal) => (
                      <span key={meal.id} className="chip">
                        {MEAL_TYPE_LABELS[meal.mealType]}{showNutritionNumbers ? ` · ${meal.calories} kcal` : ""}
                      </span>
                    ))
                  ) : (
                    <span className="chip">Aucun repas saisi</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          ) : null}
        </div>

        {showNutrition && showMealForm ? (
          <div ref={mealFormRef} className="mt-5 border border-petrol-800/10 bg-white p-3 sm:p-4">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Ajout direct</p>
                <h2 className="title-lg mt-2">Repas du {format(parseISO(selectedDate), "d MMMM", { locale: fr })}</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => setShowMealForm(false)}>
                Fermer
              </button>
            </div>
            <MealForm
              key={`calendar-meal-${selectedDate}`}
              initial={{ date: selectedDate }}
              pinInitialDate
              onCancel={() => setShowMealForm(false)}
              onSubmit={(meal) => {
                saveMeal(meal);
                setSelectedDate(meal.date);
                setMonth(parseISO(meal.date));
                setShowMealForm(false);
              }}
            />
          </div>
        ) : null}

        <div className="mt-5 border border-petrol-800/10 bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Affichage calendrier</p>
              <p className="mt-1 text-xs font-bold text-muted">Choisis la forme la plus pratique sur téléphone.</p>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {CALENDAR_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  className={`min-h-12 border px-2 py-2 text-center text-[0.62rem] font-black uppercase tracking-[0.06em] transition ${
                    viewMode === view.id
                      ? "border-petrol-800 bg-petrol-800 text-white"
                      : "border-petrol-800/10 bg-mist/50 text-petrol-800"
                  }`}
                  onClick={() => setViewMode(view.id)}
                >
                  <span className="block">{view.label}</span>
                  <span className={viewMode === view.id ? "mt-1 block text-[0.55rem] text-limeSoft" : "mt-1 block text-[0.55rem] text-muted"}>
                    {view.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewMode === "agenda" ? (
        <div className="mt-5 grid gap-2">
          {calendarDays
            .filter((day) => isSameMonth(day, month))
            .map((day) => {
              const { isoDate, completedSessions, plannedForDay, mealsForDay, movementForDay, selected, hasContent } = getDayInfo(day);

              return (
                <button
                  type="button"
                  key={`mobile-${isoDate}`}
                  onClick={() => selectDay(day)}
                  className={`w-full border p-3 text-left transition ${
                    selected
                      ? "border-petrol-800 bg-limeSoft text-petrol-900 shadow-soft"
                      : isoDate === today
                        ? "border-petrol-800/30 bg-white"
                        : "border-petrol-800/10 bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={selected ? "grid w-14 shrink-0 place-items-center bg-petrol-800 px-2 py-2 text-limeSoft" : "grid w-14 shrink-0 place-items-center bg-mist px-2 py-2 text-petrol-800"}>
                      <span className="font-display text-2xl font-black leading-none tracking-[-0.05em]">{format(day, "d")}</span>
                      <span className="mt-1 text-[0.58rem] font-black uppercase tracking-[0.08em]">{format(day, "EEE", { locale: fr })}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        {isoDate === today ? <span className="chip bg-petrol-800 text-limeSoft">Aujourd'hui</span> : null}
                        {plannedForDay.map((session) => (
                          <span key={session.id} className="chip bg-mist">
                            Prévu {plannedShortLabel(session.type)} · {session.durationMin} min
                          </span>
                        ))}
                        {completedSessions.map((session) => (
                          <span key={session.id} className="chip bg-petrol-800 text-white">
                            Fait {sessionShortLabel(session.type)} · {session.durationMin} min
                          </span>
                        ))}
                        {mealsForDay.map((meal) => (
                          <span key={meal.id} className="chip bg-white">
                            {MEAL_TYPE_LABELS[meal.mealType]}{showNutritionNumbers ? ` · ${meal.calories} kcal` : ""}
                          </span>
                        ))}
                        {(movementForDay?.steps ?? 0) > 0 ? (
                          <span className="chip bg-white">{movementForDay?.steps?.toLocaleString("fr-FR")} pas</span>
                        ) : null}
                        {!hasContent ? <span className="chip bg-white text-muted">Libre</span> : null}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
        ) : null}

        {viewMode === "compact" ? (
          <>
            <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.58rem] font-black uppercase tracking-[0.04em] text-muted sm:text-[0.62rem]">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const { isoDate, completedSessions, plannedForDay, mealsForDay, movementForDay, selected, hasContent } = getDayInfo(day);
                const muted = !isSameMonth(day, month);

                return (
                  <button
                    type="button"
                    key={`compact-${isoDate}`}
                    onClick={() => selectDay(day)}
                    className={`min-h-20 min-w-0 border p-1 text-left transition ${
                      selected
                        ? "border-petrol-800 bg-limeSoft text-petrol-900"
                        : muted
                          ? "border-petrol-800/5 bg-mist/30 opacity-60"
                          : "border-petrol-800/10 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-display text-lg font-black leading-none tracking-[-0.05em] text-petrol-800">
                        {format(day, "d")}
                      </span>
                      {isoDate === today ? <span className="h-2 w-2 shrink-0 bg-petrol-800" /> : null}
                    </div>
                    <div className="mt-2 grid gap-1 text-[0.54rem] font-black uppercase leading-none tracking-[0.02em]">
                      {plannedForDay.length ? <span className="truncate bg-mist px-1 py-1 text-petrol-800">P {plannedForDay.length}</span> : null}
                      {completedSessions.length ? <span className="truncate bg-petrol-800 px-1 py-1 text-white">F {completedSessions.length}</span> : null}
                      {mealsForDay.length ? <span className="truncate bg-white px-1 py-1 text-petrol-800">R {mealsForDay.length}</span> : null}
                      {(movementForDay?.steps ?? 0) > 0 ? <span className="truncate bg-white px-1 py-1 text-petrol-800">P {movementForDay?.steps}</span> : null}
                      {!hasContent ? <span className="text-muted/70">-</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {viewMode === "grid" ? (
          <div className="mt-5 overflow-x-auto pb-2">
            <div className="min-w-[46rem]">
        <div className="grid grid-cols-7 gap-1 text-center text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const { isoDate, completedSessions, plannedForDay, selected } = getDayInfo(day);

            return (
              <button
                type="button"
                key={isoDate}
                onClick={() => selectDay(day)}
                className={`min-h-20 min-w-0 overflow-hidden border p-1.5 text-left transition sm:min-h-32 sm:p-3 ${
                  selected
                    ? "border-petrol-800 bg-limeSoft text-petrol-900"
                    : isSameMonth(day, month)
                      ? "border-petrol-800/10 bg-white"
                      : "border-petrol-800/5 bg-mist/40 opacity-70"
                }`}
              >
                <div className="flex min-w-0 items-start justify-between gap-1">
                  <p className="min-w-0 font-display text-lg font-black tracking-[-0.05em] text-petrol-800 sm:text-2xl">{format(day, "d")}</p>
                  {isoDate === today ? (
                    <span className="hidden rounded-none bg-petrol-800 px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.08em] text-limeSoft sm:inline-flex">
                      Aujourd'hui
                    </span>
                  ) : null}
                </div>

                <div className="mt-1 flex min-w-0 flex-wrap gap-1 sm:mt-2 sm:grid">
                  {plannedForDay.map((session) => (
                    <div key={session.id} className="min-w-0 max-w-full border-l-2 border-petrol-800/20 bg-mist/60 px-1.5 py-1 sm:border-l-4 sm:px-2">
                      <p className="hidden text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted sm:block">Prévu</p>
                      <p className="max-w-full truncate text-[0.55rem] font-black text-petrol-800 sm:text-xs">
                        <span className="sm:hidden">{plannedShortLabel(session.type)}</span>
                        <span className="hidden sm:inline">{plannedLabel(session.type)}</span>
                      </p>
                    </div>
                  ))}

                  {completedSessions.map((session) => (
                    <div key={session.id} className="min-w-0 max-w-full border-l-2 border-limeSoft bg-petrol-800 px-1.5 py-1 text-white sm:border-l-4 sm:px-2">
                      <p className="hidden text-[0.62rem] font-black uppercase tracking-[0.08em] text-limeSoft sm:block">Fait</p>
                      <p className="max-w-full truncate text-[0.55rem] font-black sm:text-xs">
                        <span className="sm:hidden">{sessionShortLabel(session.type)}</span>
                        <span className="hidden sm:inline">{sessionLabel(session.type)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
            </div>
          </div>
        ) : null}
      </SectionCard>
    </>
  );
}
