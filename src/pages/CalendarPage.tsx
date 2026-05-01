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
import { MEAL_TYPE_LABELS, PLANNED_TYPE_LABELS, SESSION_TYPE_LABELS } from "../data/defaults";
import { getPlannedWeek } from "../data/trainingPlan";
import { DAILY_HABIT_LABELS } from "../hooks/useDailyHabits";
import { useMeals } from "../hooks/useMeals";
import { useSettings } from "../hooks/useSettings";
import { useStoredData } from "../hooks/useStoredData";
import type { CompletedSessionType, DailyHabitType, PlannedSessionType } from "../types";
import { getTotalWeeks, getWeekIndexForDate, toISODate } from "../utils/dates";

const habitOrder: DailyHabitType[] = ["allergies", "duolingo", "omega3", "creatine"];
const HABIT_SHORT_LABELS: Record<DailyHabitType, string> = {
  allergies: "A",
  duolingo: "D",
  omega3: "O3",
  creatine: "C"
};
const PLANNED_SHORT_LABELS: Record<PlannedSessionType, string> = {
  rest: "Repos",
  badminton: "Bad",
  racket: "Raq",
  strength: "Salle",
  run: "Run",
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
  run: "Run",
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

export default function CalendarPage() {
  const { settings } = useSettings();
  const { saveMeal } = useMeals();
  const data = useStoredData();
  const today = toISODate(new Date());
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showMealForm, setShowMealForm] = useState(false);
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
  const plannedSessions = weekIndexes.flatMap((week) => getPlannedWeek(settings, week, settings.badmintonVariant));
  const selectedHabits = data.dailyHabits.filter((habit) => habit.date === selectedDate && habit.completed);
  const selectedCompletedSessions = data.sessions.filter((session) => session.date === selectedDate && session.completed);
  const selectedPlannedSessions = plannedSessions.filter((session) => session.date === selectedDate && session.type !== "rest");
  const selectedMeals = data.meals.filter((meal) => meal.date === selectedDate);

  const selectDay = (day: Date) => {
    setMonth(day);
    setSelectedDate(toISODate(day));
  };

  useEffect(() => {
    if (!showMealForm) return;

    window.setTimeout(() => {
      mealFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [selectedDate, showMealForm]);

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Jours, habitudes et séances"
        description="Une vue simple pour voir les jours cochés, les séances prévues, les repas et ce que tu as réellement fait."
      />

      <SectionCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Mois affiché</p>
            <h2 className="title-lg mt-2 capitalize">{format(month, "MMMM yyyy", { locale: fr })}</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" className="ghost-button" onClick={() => setMonth((current) => subMonths(current, 1))}>
              <ChevronLeft className="h-4 w-4" /> Préc.
            </button>
            <button
              type="button"
              className="action-button"
              onClick={() => {
                const now = new Date();
                setMonth(now);
                setSelectedDate(toISODate(now));
              }}
            >
              Aujourd'hui
            </button>
            <button type="button" className="ghost-button" onClick={() => setMonth((current) => addMonths(current, 1))}>
              Suiv. <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-none border border-petrol-800/10 bg-mist/45 p-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-petrol-800 p-4 text-white">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Jour sélectionné</p>
            <h2 className="mt-2 font-display text-3xl font-black capitalize tracking-[-0.06em]">
              {format(parseISO(selectedDate), "EEEE d MMMM", { locale: fr })}
            </h2>
            <p className="mt-2 text-sm font-bold text-white/70">
              {selectedPlannedSessions.length} prévu · {selectedCompletedSessions.length} fait · {selectedMeals.length} repas
            </p>
            <button
              type="button"
              className="mt-4 w-full action-button bg-limeSoft text-petrol-900 hover:bg-white"
              onClick={() => setShowMealForm(true)}
            >
              <Plus className="h-4 w-4" /> Ajouter un repas ce jour
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-petrol-800/10 bg-white p-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Sport</p>
              <div className="mt-2 grid gap-2">
                {selectedPlannedSessions.length ? (
                  selectedPlannedSessions.map((session) => (
                    <p key={session.id} className="border-l-4 border-petrol-800 bg-mist/60 px-3 py-2 text-sm font-black text-petrol-800">
                      Prévu : {PLANNED_TYPE_LABELS[session.type]} · {session.durationMin} min
                    </p>
                  ))
                ) : (
                  <p className="text-sm font-bold text-muted">Aucune séance prévue.</p>
                )}
                {selectedCompletedSessions.map((session) => (
                  <p key={session.id} className="border-l-4 border-limeSoft bg-petrol-800 px-3 py-2 text-sm font-black text-white">
                    Fait : {SESSION_TYPE_LABELS[session.type]} · {session.durationMin} min
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-petrol-800/10 bg-white p-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Repas & habitudes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedHabits.length ? (
                  selectedHabits.map((habit) => (
                    <span key={`${habit.date}-${habit.type}`} className="chip bg-limeSoft">
                      {DAILY_HABIT_LABELS[habit.type]}
                    </span>
                  ))
                ) : (
                  <span className="chip">Aucune habitude cochée</span>
                )}
                {selectedMeals.map((meal) => (
                  <span key={meal.id} className="chip">
                    {MEAL_TYPE_LABELS[meal.mealType]} · {meal.calories} kcal
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showMealForm ? (
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

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const isoDate = toISODate(day);
            const dayHabits = data.dailyHabits.filter((habit) => habit.date === isoDate && habit.completed);
            const completedSessions = data.sessions.filter((session) => session.date === isoDate && session.completed);
            const plannedForDay = plannedSessions.filter((session) => session.date === isoDate && session.type !== "rest");
            const selected = isoDate === selectedDate;

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
                  {habitOrder.map((habit) =>
                    dayHabits.some((item) => item.type === habit) ? (
                      <span key={habit} className="inline-flex h-5 min-w-5 max-w-full items-center justify-center overflow-hidden rounded-none bg-limeSoft px-1 text-[0.5rem] font-black uppercase tracking-[0.04em] text-petrol-900 sm:h-auto sm:min-w-0 sm:justify-start sm:px-2 sm:py-1 sm:text-[0.62rem]">
                        <span className="sm:hidden">{HABIT_SHORT_LABELS[habit]}</span>
                        <span className="hidden truncate sm:inline">{DAILY_HABIT_LABELS[habit]}</span>
                      </span>
                    ) : null
                  )}
                </div>

                <div className="mt-1 flex min-w-0 flex-wrap gap-1 sm:mt-2 sm:grid">
                  {plannedForDay.map((session) => (
                    <div key={session.id} className="min-w-0 max-w-full border-l-2 border-petrol-800/20 bg-mist/60 px-1.5 py-1 sm:border-l-4 sm:px-2">
                      <p className="hidden text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted sm:block">Prévu</p>
                      <p className="max-w-full truncate text-[0.55rem] font-black text-petrol-800 sm:text-xs">
                        <span className="sm:hidden">{PLANNED_SHORT_LABELS[session.type]}</span>
                        <span className="hidden sm:inline">{PLANNED_TYPE_LABELS[session.type]}</span>
                      </p>
                    </div>
                  ))}

                  {completedSessions.map((session) => (
                    <div key={session.id} className="min-w-0 max-w-full border-l-2 border-limeSoft bg-petrol-800 px-1.5 py-1 text-white sm:border-l-4 sm:px-2">
                      <p className="hidden text-[0.62rem] font-black uppercase tracking-[0.08em] text-limeSoft sm:block">Fait</p>
                      <p className="max-w-full truncate text-[0.55rem] font-black sm:text-xs">
                        <span className="sm:hidden">{SESSION_SHORT_LABELS[session.type]}</span>
                        <span className="hidden sm:inline">{SESSION_TYPE_LABELS[session.type]}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
