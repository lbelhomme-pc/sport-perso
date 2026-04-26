import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { PLANNED_TYPE_LABELS, SESSION_TYPE_LABELS } from "../data/defaults";
import { getPlannedWeek } from "../data/trainingPlan";
import { DAILY_HABIT_LABELS } from "../hooks/useDailyHabits";
import { useSettings } from "../hooks/useSettings";
import { useStoredData } from "../hooks/useStoredData";
import type { DailyHabitType } from "../types";
import { getTotalWeeks, getWeekIndexForDate, toISODate } from "../utils/dates";

const habitOrder: DailyHabitType[] = ["allergies", "duolingo", "omega3", "creatine"];

export default function CalendarPage() {
  const { settings } = useSettings();
  const data = useStoredData();
  const [month, setMonth] = useState(() => new Date());
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
  const plannedSessions = weekIndexes.flatMap((week) => getPlannedWeek(settings, week, "twoBadWedThu"));

  return (
    <>
      <PageHeader
        eyebrow="Calendrier"
        title="Habitudes et sport"
        description="Une vue simple pour voir les jours cochés, les séances prévues et ce que tu as réellement fait."
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
            <button type="button" className="action-button" onClick={() => setMonth(new Date())}>
              Aujourd'hui
            </button>
            <button type="button" className="ghost-button" onClick={() => setMonth((current) => addMonths(current, 1))}>
              Suiv. <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-7">
          {calendarDays.map((day) => {
            const isoDate = toISODate(day);
            const dayHabits = data.dailyHabits.filter((habit) => habit.date === isoDate && habit.completed);
            const completedSessions = data.sessions.filter((session) => session.date === isoDate && session.completed);
            const plannedForDay = plannedSessions.filter((session) => session.date === isoDate && session.type !== "rest");

            return (
              <article
                key={isoDate}
                className={`min-h-40 border p-3 ${
                  isSameMonth(day, month) ? "border-petrol-800/10 bg-white" : "border-petrol-800/5 bg-mist/40 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{format(day, "d")}</p>
                  {isoDate === toISODate(new Date()) ? <span className="chip bg-limeSoft">Aujourd'hui</span> : null}
                </div>

                <div className="mt-3 grid gap-1">
                  {habitOrder.map((habit) =>
                    dayHabits.some((item) => item.type === habit) ? (
                      <span key={habit} className="rounded-none bg-limeSoft px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.08em] text-petrol-900">
                        {DAILY_HABIT_LABELS[habit]}
                      </span>
                    ) : null
                  )}
                </div>

                <div className="mt-3 grid gap-1">
                  {plannedForDay.map((session) => (
                    <div key={session.id} className="border-l-4 border-petrol-800/20 bg-mist/60 px-2 py-1">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted">Prévu</p>
                      <p className="text-xs font-black text-petrol-800">
                        {PLANNED_TYPE_LABELS[session.type]} - {session.durationMin} min
                      </p>
                    </div>
                  ))}

                  {completedSessions.map((session) => (
                    <div key={session.id} className="border-l-4 border-limeSoft bg-petrol-800 px-2 py-1 text-white">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.08em] text-limeSoft">Fait</p>
                      <p className="text-xs font-black">
                        {SESSION_TYPE_LABELS[session.type]} - {session.durationMin} min
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
