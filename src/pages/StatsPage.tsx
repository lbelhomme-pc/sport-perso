import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { Award, BarChart3, CalendarCheck, Dumbbell, Flame, Footprints, Gauge, HeartPulse, Lightbulb, Scale, TrendingUp, Utensils } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ComparisonBarChart } from "../components/charts/ComparisonBarChart";
import { MetricBarChart } from "../components/charts/MetricBarChart";
import { MetricLineChart } from "../components/charts/MetricLineChart";
import { ChartCard } from "../components/ui/ChartCard";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { EmptyState } from "../components/ui/EmptyState";
import { GaugeBar } from "../components/ui/GaugeBar";
import { MetricTile } from "../components/ui/MetricTile";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getPlannedWeek } from "../data/trainingPlan";
import { useStoredData } from "../hooks/useStoredData";
import { useUserModules } from "../hooks/useUserModules";
import { getSportProgressionSummary, type MotivationTone } from "../services/progressionService";
import type { CompletedSession, PlannedSession, WeightEntry } from "../types";
import { estimateNeatCalories } from "../utils/calories";
import { getCurrentWeekIndex, getMonday, getTotalWeeks, getWeekStart, parseDate, toISODate } from "../utils/dates";
import { getMealTotals } from "../utils/nutrition";
import { tracksNutritionNumbers } from "../utils/nutritionMode";
import { getAverageHeartRate, getAverageRpe, getPlannedCompletion, summarizeWeek } from "../utils/training";

function getBodyWeightForDate(weights: WeightEntry[], date: string, fallback: number): number {
  const previousWeight = [...weights].filter((entry) => entry.date <= date).sort((a, b) => b.date.localeCompare(a.date))[0];
  return previousWeight?.weight ?? fallback;
}
function countUniqueDates(items: { date: string }[]) {
  return new Set(items.map((item) => item.date)).size;
}

function hasValue<T extends Record<string, string | number>>(series: T[], key: keyof T) {
  return series.some((item) => Number(item[key]) > 0);
}

function hasWeightTrend(weights: WeightEntry[]) {
  if (weights.length < 2) return false;

  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  return differenceInCalendarDays(new Date(sorted[sorted.length - 1].date), new Date(sorted[0].date)) >= 7;
}

function averageRounded(total: number, count: number) {
  return count > 0 ? Math.round(total / count) : 0;
}

function getWeekKey(date: string) {
  return toISODate(getMonday(parseDate(date)));
}

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

function averageGroupedTotal<T>(items: T[], getKey: (item: T) => string, getValue: (item: T) => number) {
  const totals = new Map<string, number>();

  items.forEach((item) => {
    const value = getValue(item);
    if (value <= 0) return;
    const key = getKey(item);
    totals.set(key, (totals.get(key) ?? 0) + value);
  });

  return averageRounded(
    [...totals.values()].reduce((total, value) => total + value, 0),
    totals.size
  );
}

function getWeekProgramStats(plannedWeek: PlannedSession[], sessions: CompletedSession[]) {
  return getPlannedCompletion(plannedWeek, sessions);
}

const DAY_LABELS = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const WEEKDAY_INITIALS = ["D", "L", "M", "M", "J", "V", "S"];
type SportSessionChart = "volume" | "calories" | "execution";
const SPORT_SESSION_CHARTS: Array<{ id: SportSessionChart; label: string }> = [
  { id: "volume", label: "Volume" },
  { id: "calories", label: "Calories" },
  { id: "execution", label: "Prévu/fait" }
];

function formatCompactNumber(value: number) {
  return value.toLocaleString("fr-FR");
}

function formatChartDay(date: string | Date) {
  const parsed = typeof date === "string" ? parseDate(date) : date;
  return `${WEEKDAY_INITIALS[parsed.getDay()]} ${parsed.getDate()}/${parsed.getMonth() + 1}`;
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(4, value));
}

function ProgressOverviewCard({
  days,
  volumeMin,
  volumeGoalMin,
  sessions,
  completed,
  planned,
  status
}: {
  days: Array<{ label: string; value: number; goal: number; isToday: boolean }>;
  volumeMin: number;
  volumeGoalMin: number;
  sessions: number;
  completed: number;
  planned: number;
  status: "léger" | "stable" | "chargé";
}) {
  const maxValue = Math.max(...days.map((day) => day.value), ...days.map((day) => day.goal), 1);
  const completion = volumeGoalMin > 0 ? Math.round((volumeMin / volumeGoalMin) * 100) : 0;
  const statusTone = status === "chargé" ? "warning" : status === "léger" ? "info" : "lime";

  return (
    <section className="theme-stat-card animate-[premiumIn_180ms_ease-out] overflow-hidden rounded-panel border p-5 shadow-panel motion-reduce:animate-none sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="stat-muted text-xs font-black uppercase tracking-[0.14em]">Semaine sport</p>
          <p className="mt-3 font-display text-5xl font-black tracking-[-0.08em] sm:text-6xl">
            {formatCompactNumber(volumeMin)}
            <span className="stat-muted ml-2 text-2xl">min</span>
          </p>
        </div>
        <div className="text-right">
          <StatusBadge tone={statusTone}>{status}</StatusBadge>
          <p className="stat-accent mt-2 font-display text-2xl font-black tracking-[-0.05em]">{completed}/{planned || "—"}</p>
          <p className="stat-soft text-sm font-black">fait/prévu</p>
        </div>
      </div>

      <div className="stat-muted mt-5 flex items-center gap-5 text-xs font-black uppercase tracking-[0.1em]">
        <span className="inline-flex items-center gap-2">
          <span className="stat-bar h-2 w-5 rounded-full" /> Réel
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-5 border-t border-dashed border-limeSoft" /> Objectif
        </span>
      </div>

      <div className="stat-divider mt-5 grid h-56 grid-cols-7 items-end gap-2 border-y py-5">
        {days.map((day) => {
          const barHeight = day.value > 0 ? clampPercent((day.value / maxValue) * 100) : 0;
          const goalBottom = clampPercent((day.goal / maxValue) * 100);

          return (
            <div key={day.label} className="flex h-full min-w-0 flex-col justify-end gap-2">
              <div className="relative flex h-full items-end">
                <span className="stat-goal-line absolute left-0 right-0 border-t border-dashed" style={{ bottom: `${goalBottom}%` }} />
                <div
                  className={`w-full rounded-t-xl border border-petrol-800/10 ${day.isToday ? "bg-limeSoft text-petrol-900" : "stat-bar"}`}
                  style={{ height: `${barHeight}%` }}
                  title={`${day.value} min`}
                >
                  {day.isToday && day.value > 0 ? (
                    <span className="mx-auto mt-1 block w-fit bg-limeSoft px-1 text-xs font-black text-petrol-900">{day.value}</span>
                  ) : null}
                </div>
              </div>
              <p className="stat-soft truncate text-center text-xs font-black uppercase tracking-[0.04em]">{day.label}</p>
            </div>
          );
        })}
      </div>

      <div className="stat-divider grid grid-cols-3 divide-x border-b text-center">
        <div className="p-3">
          <p className="stat-soft text-xs font-black uppercase tracking-[0.08em]">Actifs</p>
          <p className="stat-accent mt-1 font-display text-xl font-black tracking-[-0.05em]">{days.filter((day) => day.value > 0).length}</p>
        </div>
        <div className="p-3">
          <p className="stat-soft text-xs font-black uppercase tracking-[0.08em]">Plan</p>
          <p className="stat-accent mt-1 font-display text-xl font-black tracking-[-0.05em]">{completion}%</p>
        </div>
        <div className="p-3">
          <p className="stat-soft text-xs font-black uppercase tracking-[0.08em]">Séances</p>
          <p className="stat-accent mt-1 font-display text-xl font-black tracking-[-0.05em]">{sessions}</p>
        </div>
      </div>
    </section>
  );
}

type CompactSportRow = {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  color: string;
  values: number[];
  dayLabels: string[];
};

function CompactSportRows({ rows }: { rows: CompactSportRow[] }) {
  if (!rows.length) return null;

  return (
    <section className="grid gap-3 sm:hidden">
      {rows.map((row) => {
        const Icon = row.icon;
        const maxValue = Math.max(...row.values, 1);

        return (
          <article key={row.id} className="theme-stat-card grid grid-cols-[minmax(0,1fr)_7.5rem] items-center gap-4 rounded-card border p-4 shadow-panel">
            <div className="min-w-0">
              <Icon className="h-5 w-5" style={{ color: row.color }} aria-hidden="true" />
              <p className="stat-soft mt-2 text-xs font-black uppercase tracking-[0.08em]">{row.label}</p>
              <p className="mt-1 truncate font-display text-3xl font-black tracking-[-0.06em]">{row.value}</p>
              <p className="stat-soft mt-1 text-xs font-bold leading-5">{row.helper}</p>
            </div>

            <div className="stat-divider border-l pl-3" aria-hidden="true">
              <div className="grid h-20 grid-cols-7 items-end gap-1">
                {row.values.map((value, index) => {
                  const height = value > 0 ? clampPercent((value / maxValue) * 100) : 9;

                  return (
                    <span
                      key={`${row.id}-${index}`}
                      className="mx-auto w-2 rounded-full"
                      style={{
                        height: `${height}%`,
                        backgroundColor: row.color,
                        opacity: value > 0 ? 1 : 0.18
                      }}
                    />
                  );
                })}
              </div>
              <div className="stat-soft mt-1 grid grid-cols-7 gap-1 text-center text-xs font-black uppercase leading-none tracking-[0.02em]">
                {row.dayLabels.map((label, index) => (
                  <span key={`${row.id}-label-${index}`}>{label}</span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ChartEmptyState({
  icon,
  title,
  message,
  to,
  actionLabel
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  to: string;
  actionLabel: string;
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      message={message}
      action={
        <Link to={to} className="ghost-button w-full justify-center">
          {actionLabel}
        </Link>
      }
    />
  );
}

function StatsBlock({ title, children }: { title: string; children: ReactNode }) {
  return <ChartCard title={title} variant="plain">{children}</ChartCard>;
}

function formatTrendPercent(value: number) {
  if (!Number.isFinite(value) || value === 0) return "Stable";
  return `${value > 0 ? "+" : ""}${Math.round(value)} %`;
}

type SportSummaryTileData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "lime" | "warm" | "cool";
};

function SportSummaryTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default"
}: SportSummaryTileData) {
  const metricTone = tone === "lime" ? "lime" : tone === "warm" ? "warning" : tone === "cool" ? "info" : "default";
  return <MetricTile icon={Icon} label={label} value={value} hint={hint} tone={metricTone} />;
}

type DecisionCardTone = "lime" | "warning" | "danger" | "info";

type DecisionCardData = {
  icon: LucideIcon;
  question: string;
  answer: string;
  hint: string;
  tone: DecisionCardTone;
  gaugeValue: number;
  gaugeLabel: string;
};

const decisionToneClasses: Record<DecisionCardTone, string> = {
  lime: "border-limeSoft/70 bg-limeSoft/45",
  warning: "border-[#F5A623]/30 bg-[#F5A623]/12",
  danger: "border-red-900/10 bg-red-50",
  info: "border-[#24D9D2]/20 bg-[#24D9D2]/10"
};

const motivationToneClasses: Record<MotivationTone, string> = {
  positive: "border-limeSoft/60 bg-limeSoft/35",
  care: "border-red-900/10 bg-red-50",
  neutral: "border-petrol-800/10 bg-white/75"
};

const motivationIconClasses: Record<MotivationTone, string> = {
  positive: "bg-limeSoft text-petrol-900",
  care: "bg-red-900/10 text-red-950",
  neutral: "bg-mist text-petrol-800"
};

function DecisionCard({ icon: Icon, question, answer, hint, tone, gaugeValue, gaugeLabel }: DecisionCardData) {
  return (
    <article className={`rounded-card border p-4 shadow-sm ${decisionToneClasses[tone]}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/75 text-petrol-800">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">{question}</p>
          <p className="mt-1 font-display text-2xl font-black tracking-[-0.055em] text-petrol-800">{answer}</p>
          <p className="mt-1 text-sm font-bold leading-5 text-muted">{hint}</p>
          <div className="mt-3">
            <GaugeBar
              label={question}
              value={gaugeValue}
              valueLabel={gaugeLabel}
              tone={tone === "danger" ? "danger" : tone === "warning" ? "warning" : tone === "info" ? "info" : "lime"}
              compact
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function StatsPage() {
  const data = useStoredData();
  const { isEnabled } = useUserModules();
  const [sportSessionChart, setSportSessionChart] = useState<SportSessionChart>("volume");
  const showSport = isEnabled("training") || isEnabled("sessions");
  const showNutrition = isEnabled("nutrition");
  const showNutritionNumbers = showNutrition && tracksNutritionNumbers(data.settings);
  const showWeight = isEnabled("weight");
  const calendarEnabled = isEnabled("calendar");
  const totalWeeks = getTotalWeeks(data.settings.startDate, data.settings.targetDate);
  const currentWeek = getCurrentWeekIndex(data.settings.startDate, data.settings.targetDate);
  const currentPlannedWeek = getPlannedWeek(data.settings, currentWeek, data.settings.badmintonVariant);
  const currentWeekVolumeGoal = currentPlannedWeek
    .filter((session) => session.type !== "rest")
    .reduce((total, session) => total + session.durationMin, 0);
  const weekSeries = Array.from({ length: totalWeeks }, (_, index) => {
    const week = index + 1;
    const plannedWeek = getPlannedWeek(data.settings, week, data.settings.badmintonVariant);
    const summary = summarizeWeek(week, getWeekStart(data.settings.startDate, week), plannedWeek, data.sessions);
    const programStats = getWeekProgramStats(plannedWeek, data.sessions);

    return {
      week: `S${week}`,
      volume: summary.volumeMin,
      calories: summary.sportCalories,
      planned: programStats.planned,
      completed: programStats.completed,
      completionRate: programStats.ratio
    };
  });
  const currentWeekProgram = weekSeries[currentWeek - 1];
  const progressStart = subDays(new Date(), 6);
  const progressStartIso = toISODate(progressStart);
  const progressDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(progressStart, index);
    const isoDate = toISODate(date);
    const sessionsForDay = data.sessions.filter((session) => session.completed && session.date === isoDate);
    const context = data.dailyContexts.find((item) => item.date === isoDate);
    const heartRates = sessionsForDay
      .map((session) => session.averageHeartRate)
      .filter((heartRate): heartRate is number => typeof heartRate === "number" && heartRate > 0);

    return {
      label: DAY_LABELS[date.getDay()],
      shortLabel: WEEKDAY_INITIALS[date.getDay()],
      date: isoDate,
      value: sessionsForDay.reduce((total, session) => total + session.durationMin, 0),
      goal: Math.max(10, Math.round((currentWeekVolumeGoal || 210) / 7)),
      isToday: isoDate === toISODate(new Date()),
      steps: context?.steps ?? 0,
      floors: context?.floors ?? 0,
      calories: sessionsForDay.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0),
      sessions: sessionsForDay.length,
      heartRate: averageRounded(
        heartRates.reduce((total, heartRate) => total + heartRate, 0),
        heartRates.length
      )
    };
  });
  const progressVolumeMin = progressDays.reduce((total, day) => total + day.value, 0);
  const progressSteps = progressDays.reduce((total, day) => total + day.steps, 0);
  const progressFloors = progressDays.reduce((total, day) => total + day.floors, 0);
  const progressCalories = progressDays.reduce((total, day) => total + day.calories, 0);
  const progressSessionCount = progressDays.reduce((total, day) => total + day.sessions, 0);
  const currentWeekStatus: "léger" | "stable" | "chargé" =
    currentWeekVolumeGoal > 0 && progressVolumeMin > currentWeekVolumeGoal * 1.1
      ? "chargé"
      : (currentWeekProgram?.completionRate ?? 0) < 45
        ? "léger"
        : "stable";

  const startDaily = subDays(new Date(), 20);
  const dailySeries = Array.from({ length: 21 }, (_, index) => {
    const date = toISODate(addDays(startDaily, index));
    const totals = getMealTotals(data.meals.filter((meal) => meal.date === date));
    const context = data.dailyContexts.find((item) => item.date === date);
    const steps = context?.steps ?? 0;
    const floors = context?.floors ?? 0;
    const bodyWeight = getBodyWeightForDate(data.weights, date, data.settings.defaultBodyWeight);
    const neat = estimateNeatCalories(steps, floors, bodyWeight);

    return {
      date: formatChartDay(date),
      calories: Math.round(totals.calories),
      steps,
      floors,
      neat,
      protein: Math.round(totals.protein)
    };
  });

  const weightSeries = data.weights.map((entry) => ({
    date: formatChartDay(entry.date),
    weight: entry.weight
  }));

  const sessionsWithCalories = data.sessions.filter((session) => session.completed && (session.caloriesBurned ?? 0) > 0);
  const completedSportSessions = data.sessions.filter((session) => session.completed);
  const hasCompletedSportSession = completedSportSessions.length > 0;
  const totalSportCalories = sessionsWithCalories.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const stepContexts = data.dailyContexts.filter((context) => (context.steps ?? 0) > 0);
  const floorContexts = data.dailyContexts.filter((context) => (context.floors ?? 0) > 0);
  const showMovement = calendarEnabled;
  const totalRecordedSteps = stepContexts.reduce((total, context) => total + (context.steps ?? 0), 0);
  const totalRecordedFloors = floorContexts.reduce((total, context) => total + (context.floors ?? 0), 0);
  const averageSportCaloriesPerSession = averageRounded(totalSportCalories, sessionsWithCalories.length);
  const averageStepsPerDay = averageRounded(totalRecordedSteps, stepContexts.length);
  const averageStepsPerWeek = averageGroupedTotal(stepContexts, (context) => getWeekKey(context.date), (context) => context.steps ?? 0);
  const averageStepsPerMonth = averageGroupedTotal(stepContexts, (context) => getMonthKey(context.date), (context) => context.steps ?? 0);
  const averageFloorsPerDay = averageRounded(totalRecordedFloors, floorContexts.length);
  const averageFloorsPerWeek = averageGroupedTotal(floorContexts, (context) => getWeekKey(context.date), (context) => context.floors ?? 0);
  const averageFloorsPerMonth = averageGroupedTotal(floorContexts, (context) => getMonthKey(context.date), (context) => context.floors ?? 0);
  const totalSteps21Days = dailySeries.reduce((total, day) => total + day.steps, 0);
  const totalFloors21Days = dailySeries.reduce((total, day) => total + day.floors, 0);
  const totalNeat21Days = dailySeries.reduce((total, day) => total + day.neat, 0);
  const totalPlannedSessions = weekSeries.reduce((total, week) => total + week.planned, 0);
  const totalCompletedSessions = weekSeries.reduce((total, week) => total + week.completed, 0);
  const totalVolumeMinutes = weekSeries.reduce((total, week) => total + week.volume, 0);
  const totalFood21Days = dailySeries.reduce((total, day) => total + day.calories, 0);
  const totalProtein21Days = dailySeries.reduce((total, day) => total + day.protein, 0);
  const mealDaysCount = countUniqueDates(data.meals);
  const movementDaysCount = countUniqueDates(data.dailyContexts.filter((context) => (context.steps ?? 0) > 0 || (context.floors ?? 0) > 0));
  const floorDaysCount = countUniqueDates(data.dailyContexts.filter((context) => (context.floors ?? 0) > 0));
  const weightTrendReady = hasWeightTrend(data.weights);
  const sessionTrendReady = completedSportSessions.length >= 2;
  const sportCaloriesReady = sessionsWithCalories.length >= 2;
  const foodTrendReady = mealDaysCount >= 3;
  const movementTrendReady = movementDaysCount >= 3;
  const floorsTrendReady = floorDaysCount >= 2;
  const executionTrendReady = totalCompletedSessions > 0;
  const averageHeartRate = getAverageHeartRate(data.sessions);
  const averageRpe = getAverageRpe(data.sessions);
  const progressionSummary = getSportProgressionSummary({
    sessions: data.sessions,
    dailyContexts: data.dailyContexts
  });
  const recentDailyContexts = data.dailyContexts.filter((context) => context.date >= progressStartIso);
  const highFatigueDays = recentDailyContexts.filter((context) => (context.fatigueMorning ?? 0) >= 7).length;
  const painDays = recentDailyContexts.filter((context) => (context.painMorning ?? 0) >= 4 || context.pain).length;
  const hardSessions7d = data.sessions.filter((session) => session.completed && session.date >= progressStartIso && (session.rpe ?? 0) >= 8).length;
  const recoveryNeedsCare = highFatigueDays >= 2 || painDays > 0 || hardSessions7d >= 3 || progressionSummary.averageRpe7d >= 8;
  const regularityAnswer = hasCompletedSportSession
    ? currentWeekProgram?.planned
      ? `${currentWeekProgram.completed}/${currentWeekProgram.planned}`
      : `${progressionSummary.activeDays7d}/7 j`
    : "À lancer";
  const regularityTone: DecisionCardTone =
    progressionSummary.activeDays7d >= 3 || (currentWeekProgram?.completionRate ?? 0) >= 60
      ? "lime"
      : progressionSummary.activeDays7d >= 1 || (currentWeekProgram?.completed ?? 0) > 0
        ? "warning"
        : "info";
  const progressionTone: DecisionCardTone =
    progressionSummary.volumeTrendPercent > 10
      ? "lime"
      : progressionSummary.volumeTrendPercent < -25
        ? "warning"
        : "info";
  const recoveryTone: DecisionCardTone = recoveryNeedsCare ? "danger" : progressionSummary.averageRpe7d >= 7 ? "warning" : "lime";
  const recoveryGaugeValue = recoveryNeedsCare ? 38 : progressionSummary.averageRpe7d >= 7 ? 62 : 84;
  const decisionCards: DecisionCardData[] = [
    {
      icon: CalendarCheck,
      question: "Régularité",
      answer: regularityAnswer,
      hint: hasCompletedSportSession
        ? currentWeekProgram?.planned
          ? `${currentWeekProgram.completionRate} % du programme validé cette semaine.`
          : `${progressionSummary.sessions7d} séance${progressionSummary.sessions7d > 1 ? "s" : ""} sur 7 jours.`
        : "Valide une première séance pour créer un repère.",
      tone: regularityTone,
      gaugeValue: currentWeekProgram?.planned ? currentWeekProgram.completionRate : Math.min(100, (progressionSummary.activeDays7d / 7) * 100),
      gaugeLabel: currentWeekProgram?.planned ? `${currentWeekProgram.completed}/${currentWeekProgram.planned}` : `${progressionSummary.activeDays7d}/7`
    },
    {
      icon: TrendingUp,
      question: "Progression",
      answer: hasCompletedSportSession ? formatTrendPercent(progressionSummary.volumeTrendPercent) : "En attente",
      hint:
        !hasCompletedSportSession
          ? "La progression apparaîtra après tes premières séances."
          : progressionSummary.volumeTrendPercent > 10
          ? "Le volume monte. Garde de la marge."
          : progressionSummary.volumeTrendPercent < -25
            ? "Volume en baisse : normal si semaine chargée ou récupération."
            : "Stable : bon signe si tu te sens frais.",
      tone: progressionTone,
      gaugeValue: Math.min(100, Math.max(0, progressionSummary.volumeTrendPercent + 50)),
      gaugeLabel: progressionSummary.volumeTrendPercent ? `${Math.round(progressionSummary.volumeTrendPercent)} %` : "stable"
    },
    {
      icon: HeartPulse,
      question: "Lever le pied ?",
      answer: recentDailyContexts.length || hasCompletedSportSession ? (recoveryNeedsCare ? "Oui" : "Pas forcément") : "À noter",
      hint: recentDailyContexts.length || hasCompletedSportSession
        ? recoveryNeedsCare
          ? "Fatigue, douleur ou RPE haut : privilégie une version courte."
          : "Signaux corrects. Reste propre, pas besoin de forcer."
        : "Renseigne fatigue, douleur ou RPE pour fiabiliser ce signal.",
      tone: recoveryTone,
      gaugeValue: recoveryGaugeValue,
      gaugeLabel: recoveryNeedsCare ? "allège" : progressionSummary.averageRpe7d >= 7 ? "modéré" : "OK"
    }
  ];
  const usefulBadges = progressionSummary.badges.filter((badge) => badge.earned).slice(0, 3);
  const quickMotivationMessages = progressionSummary.motivationMessages.slice(0, 2);
  const progressHeartRateValues = progressDays.map((day) => day.heartRate);
  const progressHeartRates = progressHeartRateValues.filter((heartRate) => heartRate > 0);
  const progressHeartRate = averageRounded(
    progressHeartRates.reduce((total, heartRate) => total + heartRate, 0),
    progressHeartRates.length
  );
  const compactSportRows: CompactSportRow[] = [
    showSport
      ? {
          id: "weekly-sessions",
          icon: Dumbbell,
          label: "Séances",
          value: `${progressSessionCount}`,
          helper: `${progressVolumeMin} min sur 7 jours`,
          color: "#DCEFA3",
          values: progressDays.map((day) => day.value),
          dayLabels: progressDays.map((day) => day.shortLabel)
        }
      : null,
    showSport
      ? {
          id: "sport-calories",
          icon: Flame,
          label: "Calories sport",
          value: `${formatCompactNumber(progressCalories)} kcal`,
          helper: "Calories saisies dans les séances",
          color: "#F5A623",
          values: progressDays.map((day) => day.calories),
          dayLabels: progressDays.map((day) => day.shortLabel)
        }
      : null,
    showMovement
      ? {
          id: "steps",
          icon: Footprints,
          label: "Pas",
          value: formatCompactNumber(progressSteps),
          helper: "Total des 7 derniers jours",
          color: "#24D9D2",
          values: progressDays.map((day) => day.steps),
          dayLabels: progressDays.map((day) => day.shortLabel)
        }
      : null,
    showMovement && progressFloors > 0
      ? {
          id: "floors",
          icon: Footprints,
          label: "Étages",
          value: formatCompactNumber(progressFloors),
          helper: "Étages saisis cette semaine",
          color: "#7EE6A4",
          values: progressDays.map((day) => day.floors),
          dayLabels: progressDays.map((day) => day.shortLabel)
        }
      : null,
    showSport && progressHeartRate > 0
      ? {
          id: "heart-rate",
          icon: HeartPulse,
          label: "FC moyenne",
          value: `${progressHeartRate} bpm`,
          helper: "Moyenne des séances avec FC",
          color: "#F06AD8",
          values: progressHeartRateValues,
          dayLabels: progressDays.map((day) => day.shortLabel)
        }
      : null
  ].filter((row): row is CompactSportRow => Boolean(row));
  const sportSummaryTileCandidates: Array<SportSummaryTileData | null> = [
    currentWeekProgram?.planned
      ? {
          icon: CalendarCheck,
          label: "Programme",
          value: `${currentWeekProgram.completed}/${currentWeekProgram.planned}`,
          hint: `${currentWeekProgram.completionRate} % validé`,
          tone: "lime" as const
        }
      : null,
    data.sessions.length
      ? {
          icon: Dumbbell,
          label: "Séances",
          value: data.sessions.length,
          hint: "Total enregistré",
          tone: "default" as const
        }
      : null,
    totalVolumeMinutes > 0
      ? {
          icon: Gauge,
          label: "Volume",
          value: `${formatCompactNumber(totalVolumeMinutes)} min`,
          hint: "Total affiché",
          tone: "cool" as const
        }
      : null,
    totalSportCalories > 0
      ? {
          icon: Flame,
          label: "Calories",
          value: `${formatCompactNumber(totalSportCalories)}`,
          hint: averageSportCaloriesPerSession ? `${averageSportCaloriesPerSession} kcal / séance` : "Total sport",
          tone: "warm" as const
        }
      : null,
    averageRpe
      ? {
          icon: TrendingUp,
          label: "RPE moyen",
          value: averageRpe,
          hint: "Ressenti global",
          tone: "default" as const
        }
      : null,
    averageHeartRate
      ? {
          icon: HeartPulse,
          label: "FC moyenne",
          value: `${averageHeartRate}`,
          hint: "bpm",
          tone: "default" as const
        }
      : null
  ];
  const sportSummaryTiles = sportSummaryTileCandidates.filter((item): item is SportSummaryTileData => Boolean(item));
  const sportChartModes = SPORT_SESSION_CHARTS.filter((mode) => {
    if (mode.id === "volume") return sessionTrendReady && hasValue(weekSeries, "volume");
    if (mode.id === "calories") return sportCaloriesReady && hasValue(weekSeries, "calories");
    return executionTrendReady;
  });
  const selectedSportSessionChart = sportChartModes.some((mode) => mode.id === sportSessionChart)
    ? sportSessionChart
    : sportChartModes[0]?.id ?? "volume";
  const hasSportCharts = sportChartModes.length > 0;
  const hasSportDetails = hasCompletedSportSession;
  const hasUsefulStats =
    (showSport && Boolean(currentWeekProgram?.planned)) ||
    (showSport && sessionTrendReady) ||
    (showNutritionNumbers && foodTrendReady) ||
    (showWeight && weightTrendReady) ||
    (showMovement && (movementTrendReady || stepContexts.length > 0 || floorContexts.length > 0)) ||
    (showSport && sportCaloriesReady) ||
    (showSport && sessionsWithCalories.length > 0) ||
    (showSport && executionTrendReady);
  const hasMovementAverageCards =
    (showMovement && averageStepsPerDay > 0) ||
    (showMovement && averageStepsPerWeek > 0) ||
    (showMovement && averageStepsPerMonth > 0) ||
    (showMovement && averageFloorsPerDay > 0) ||
    (showMovement && averageFloorsPerWeek > 0) ||
    (showMovement && averageFloorsPerMonth > 0);

  if (!hasUsefulStats) {
    return (
      <>
        <PageHeader title="Tes tendances arrivent bientôt" />

        <SectionCard className="p-5 sm:p-6">
          <EmptyState
            icon={BarChart3}
            title="Pas encore assez de données"
            message="Commence par une ou deux actions simples. L'app affichera les tendances dès que les données deviennent utiles."
            action={
              <Link to={showSport ? "/sessions" : "/settings"} className="action-button mx-auto">
                {showSport ? "Ajouter une séance" : "Choisir mes modules"}
              </Link>
            }
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {showSport ? (
              <ChartEmptyState
                icon={Dumbbell}
                title="Aucune séance enregistrée cette semaine"
                message="Ajoute 2 séances pour voir ton volume, ta régularité et les séances prévues vs réalisées."
                to="/sessions"
                actionLabel="Ajouter une séance"
              />
            ) : null}
            {showNutritionNumbers ? (
              <ChartEmptyState
                icon={Utensils}
                title="Pas encore de tendance nutrition"
                message="Ajoute 3 jours de repas pour voir les calories et les protéines évoluer sans graphique fantôme."
                to="/meals"
                actionLabel="Ajouter un repas"
              />
            ) : null}
            {showWeight ? (
              <ChartEmptyState
                icon={Scale}
                title="Tendance poids en attente"
                message="Ajoute 2 pesées espacées de 7 jours pour afficher une tendance fiable plutôt qu'un bruit quotidien."
                to="/weight"
                actionLabel="Saisir le poids"
              />
            ) : null}
            {showMovement ? (
              <ChartEmptyState
                icon={Footprints}
                title="Mouvement quotidien absent"
                message="Ajoute tes pas sur 3 jours pour voir la dépense de mouvement estimée."
                to="/calendar"
                actionLabel="Saisir les pas"
              />
            ) : null}
          </div>
        </SectionCard>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Tendances" />

      {showSport ? (
        <SectionCard className="p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="title-lg">Réponse rapide</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                Trois signaux pour décider quoi faire, pas un audit de laboratoire.
              </p>
            </div>
            <StatusBadge tone={recoveryNeedsCare ? "danger" : "lime"}>{recoveryNeedsCare ? "Alléger aujourd'hui" : "Feu vert prudent"}</StatusBadge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {decisionCards.map((card) => (
              <DecisionCard key={card.question} {...card} />
            ))}
          </div>

          {hasCompletedSportSession || currentWeekProgram?.planned ? (
            <div className="mt-4">
              <ProgressOverviewCard
                days={progressDays}
                volumeMin={progressVolumeMin}
                volumeGoalMin={currentWeekVolumeGoal || 210}
                sessions={progressSessionCount}
                completed={currentWeekProgram?.completed ?? progressSessionCount}
                planned={currentWeekProgram?.planned ?? 0}
                status={currentWeekStatus}
              />
            </div>
          ) : null}

        </SectionCard>
      ) : null}

      {showSport && hasSportCharts ? (
        <SectionCard className="p-4 sm:p-5">
          <ChartCard
            title="Graphique principal"
            subtitle="Affiché seulement quand les données deviennent parlantes."
            variant="plain"
            action={
              sportChartModes.length > 1 ? (
                <div className="tab-control grid min-w-full gap-1 sm:min-w-[22rem]" style={{ gridTemplateColumns: `repeat(${sportChartModes.length}, minmax(0, 1fr))` }}>
                  {sportChartModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`tab-button ${selectedSportSessionChart === mode.id ? "tab-button-active" : "tab-button-idle"}`}
                      onClick={() => setSportSessionChart(mode.id)}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              ) : undefined
            }
          >
            {selectedSportSessionChart === "volume" ? (
              <MetricBarChart
                data={weekSeries}
                xKey="week"
                yKey="volume"
                suffix=" min"
                summary={`Cette semaine : ${progressSessionCount} séance${progressSessionCount > 1 ? "s" : ""}, ${progressVolumeMin} min.`}
              />
            ) : null}

            {selectedSportSessionChart === "calories" ? (
              <MetricBarChart
                data={weekSeries}
                xKey="week"
                yKey="calories"
                color="#DCEFA3"
                suffix=" kcal"
                summary={`Cette semaine : ${progressCalories} kcal sport. Total enregistré : ${totalSportCalories} kcal.`}
              />
            ) : null}

            {selectedSportSessionChart === "execution" ? (
              <ComparisonBarChart
                data={weekSeries}
                xKey="week"
                firstKey="planned"
                secondKey="completed"
                firstName="Prévues"
                secondName="Réalisées"
                summary={`Cette semaine : ${currentWeekProgram?.completed ?? 0}/${currentWeekProgram?.planned ?? 0} séances. Régularité ${currentWeekStatus}.`}
              />
            ) : null}
          </ChartCard>
        </SectionCard>
      ) : null}

      {showSport && !hasSportCharts ? (
        <SectionCard className="p-4 sm:p-5">
          <ChartEmptyState
            icon={Dumbbell}
            title="Graphiques masqués pour l'instant"
            message="Ajoute deux séances validées pour afficher des tendances utiles plutôt qu'une page de zéros."
            to="/sessions"
            actionLabel="Ajouter une séance"
          />
        </SectionCard>
      ) : null}

      {showSport && hasSportDetails ? (
        <CollapsibleSectionCard title="Détails sport" summary="Records utiles, tendance 7 jours et badges gagnés.">
          <section className="theme-stat-card overflow-hidden rounded-panel border p-4 shadow-panel sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-petrol-800 text-limeSoft">
                  <Dumbbell className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="stat-muted mt-4 text-xs font-black uppercase tracking-[0.1em]">Synthèse sport</p>
                <h2 className="mt-1 font-display text-4xl font-black tracking-[-0.07em] sm:text-5xl">
                  {formatCompactNumber(progressionSummary.volume7d)}
                  <span className="stat-muted ml-2 text-2xl">min</span>
                </h2>
                <p className="stat-soft mt-1 text-sm font-bold">
                  {progressionSummary.sessions7d} séance{progressionSummary.sessions7d > 1 ? "s" : ""} sur 7 jours, {progressionSummary.activeDays7d} jour{progressionSummary.activeDays7d > 1 ? "s" : ""} actif{progressionSummary.activeDays7d > 1 ? "s" : ""}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center sm:min-w-64">
                <div className="rounded-card bg-white/70 px-3 py-2">
                  <p className="stat-soft text-xs font-black uppercase tracking-[0.06em]">Tendance 7 j</p>
                  <p className="stat-accent mt-1 font-display text-2xl font-black tracking-[-0.05em]">
                    {formatTrendPercent(progressionSummary.volumeTrendPercent)}
                  </p>
                </div>
                <div className="rounded-card bg-white/70 px-3 py-2">
                  <p className="stat-soft text-xs font-black uppercase tracking-[0.06em]">RPE 7 j</p>
                  <p className="stat-accent mt-1 font-display text-2xl font-black tracking-[-0.05em]">
                    {progressionSummary.averageRpe7d || "n/a"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {sportSummaryTiles.map((tile) => (
                <SportSummaryTile key={tile.label} {...tile} />
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="grid gap-3 rounded-card bg-white/70 p-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-petrol-800 text-limeSoft">
                    <Gauge className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-bold leading-6 text-ink">{progressionSummary.coachingMessage}</p>
                </div>

                {progressionSummary.records.length ? (
                  <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                    {progressionSummary.records.slice(0, 3).map((record) => (
                      <div key={`${record.label}-${record.value}`} className="rounded-card bg-mist/55 p-3">
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.06em] text-muted">
                          <TrendingUp className="h-4 w-4" aria-hidden="true" /> {record.label}
                        </p>
                        <p className="mt-1 font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{record.value}</p>
                        <p className="mt-1 text-xs font-bold text-muted">{record.hint}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {usefulBadges.length ? (
                  <div className="flex flex-wrap gap-2">
                    {usefulBadges.map((badge) => (
                      <StatusBadge key={badge.id} icon={Award} tone="lime" title={badge.hint}>
                        {badge.label}
                      </StatusBadge>
                    ))}
                  </div>
                ) : null}

                {quickMotivationMessages.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {quickMotivationMessages.map((message) => (
                      <article key={message.id} className={`rounded-card border p-3 shadow-sm ${motivationToneClasses[message.tone]}`}>
                        <div className="flex items-start gap-3">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${motivationIconClasses[message.tone]}`}>
                            <Lightbulb className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-petrol-800">{message.title}</p>
                            <p className="mt-1 text-sm font-semibold leading-5 text-muted">{message.message}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

          </section>
        </CollapsibleSectionCard>
      ) : null}

      {showMovement ? (
        <CollapsibleSectionCard title="Mouvement">
          <div className="grid gap-4">
            {hasMovementAverageCards ? (
              <StatsBlock title="Moyennes pas et étages">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {averageStepsPerDay ? (
                    <MetricTile label="Pas / jour" value={averageStepsPerDay.toLocaleString("fr-FR")} hint={`${stepContexts.length} jour${stepContexts.length > 1 ? "s" : ""} renseigné${stepContexts.length > 1 ? "s" : ""}`} tone="lime" />
                  ) : null}
                  {averageStepsPerWeek ? <MetricTile label="Pas / semaine" value={averageStepsPerWeek.toLocaleString("fr-FR")} hint="Semaines avec pas renseignés" /> : null}
                  {averageStepsPerMonth ? <MetricTile label="Pas / mois" value={averageStepsPerMonth.toLocaleString("fr-FR")} hint="Mois avec pas renseignés" /> : null}
                  {averageFloorsPerDay ? (
                    <MetricTile label="Étages / jour" value={averageFloorsPerDay.toLocaleString("fr-FR")} hint={`${floorContexts.length} jour${floorContexts.length > 1 ? "s" : ""} renseigné${floorContexts.length > 1 ? "s" : ""}`} tone="lime" />
                  ) : null}
                  {averageFloorsPerWeek ? <MetricTile label="Étages / semaine" value={averageFloorsPerWeek.toLocaleString("fr-FR")} hint="Semaines avec étages renseignés" /> : null}
                  {averageFloorsPerMonth ? <MetricTile label="Étages / mois" value={averageFloorsPerMonth.toLocaleString("fr-FR")} hint="Mois avec étages renseignés" /> : null}
                </div>
              </StatsBlock>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-2">
              <StatsBlock title="Pas quotidiens">
                {movementTrendReady && hasValue(dailySeries, "steps") ? (
                  <MetricBarChart
                    data={dailySeries}
                    xKey="date"
                    yKey="steps"
                    color="#0A4B61"
                    suffix=" pas"
                    summary={`${totalSteps21Days.toLocaleString("fr-FR")} pas saisis sur 21 jours.`}
                  />
                ) : (
                  <ChartEmptyState
                    icon={Footprints}
                    title="Ajoute tes pas sur 3 jours"
                    message="Trois journées suffisent pour commencer à voir une habitude de mouvement fiable."
                    to="/calendar"
                    actionLabel="Saisir les pas"
                  />
                )}
              </StatsBlock>

              <StatsBlock title="Calories via pas + étages">
                {movementTrendReady && hasValue(dailySeries, "neat") ? (
                  <MetricLineChart
                    data={dailySeries}
                    xKey="date"
                    yKey="neat"
                    color="#DCEFA3"
                    suffix=" kcal"
                    summary={`${totalNeat21Days} kcal de mouvement estimées via pas + étages.`}
                  />
                ) : (
                  <ChartEmptyState
                    icon={Footprints}
                    title="Mouvement pas encore calculable"
                    message="Ajoute tes pas, et si possible les étages, sur 3 jours pour afficher la dépense de mouvement."
                    to="/calendar"
                    actionLabel="Saisir mouvement"
                  />
                )}
              </StatsBlock>

              <StatsBlock title="Étages quotidiens">
                {floorsTrendReady && hasValue(dailySeries, "floors") ? (
                  <MetricBarChart
                    data={dailySeries}
                    xKey="date"
                    yKey="floors"
                    color="#DCEFA3"
                    suffix=" étages"
                    summary={`${totalFloors21Days.toLocaleString("fr-FR")} étages saisis sur 21 jours.`}
                  />
                ) : (
                  <ChartEmptyState
                    icon={Footprints}
                    title="Étages non renseignés"
                    message="Ajoute les étages sur 2 jours si tu veux isoler leur contribution au mouvement."
                    to="/calendar"
                    actionLabel="Saisir les étages"
                  />
                )}
              </StatsBlock>
            </div>
          </div>
        </CollapsibleSectionCard>
      ) : null}

      {showNutritionNumbers ? (
        <CollapsibleSectionCard title="Nutrition">
          <div className="grid gap-4 xl:grid-cols-2">
            <StatsBlock title="Calories alimentaires">
              {foodTrendReady && hasValue(dailySeries, "calories") ? (
                <MetricLineChart
                  data={dailySeries}
                  xKey="date"
                  yKey="calories"
                  suffix=" kcal"
                  summary={`${totalFood21Days} kcal saisies sur les 21 derniers jours.`}
                />
              ) : (
                <ChartEmptyState
                  icon={Utensils}
                  title="Ajoute 3 jours de repas"
                  message="La tendance calories devient intéressante à partir de 3 journées saisies, même approximatives."
                  to="/meals"
                  actionLabel="Ajouter un repas"
                />
              )}
            </StatsBlock>

            <StatsBlock title="Protéines">
              {foodTrendReady && hasValue(dailySeries, "protein") ? (
                <MetricLineChart
                  data={dailySeries}
                  xKey="date"
                  yKey="protein"
                  color="#0A4B61"
                  suffix=" g"
                  summary={`${totalProtein21Days} g de protéines saisies sur les 21 derniers jours.`}
                />
              ) : (
                <ChartEmptyState
                  icon={Utensils}
                  title="Protéines pas encore lisibles"
                  message="Ajoute 3 jours de repas pour voir si ton apport protéiné devient régulier."
                  to="/meals"
                  actionLabel="Ajouter un repas"
                />
              )}
            </StatsBlock>
          </div>
        </CollapsibleSectionCard>
      ) : null}

      {showWeight ? (
        <CollapsibleSectionCard title="Poids">
          <StatsBlock title="Courbe">
            {weightTrendReady ? (
              <MetricLineChart
                data={weightSeries}
                xKey="date"
                yKey="weight"
                suffix=" kg"
                summary={`${weightSeries.length} pesée${weightSeries.length > 1 ? "s" : ""} enregistrée${weightSeries.length > 1 ? "s" : ""}.`}
              />
            ) : (
              <ChartEmptyState
                icon={Scale}
                title="Ajoute 2 pesées espacées de 7 jours"
                message="Le poids varie beaucoup au jour le jour. Deux points espacés évitent une fausse tendance."
                to="/weight"
                actionLabel="Saisir le poids"
              />
            )}
          </StatsBlock>
        </CollapsibleSectionCard>
      ) : null}

    </>
  );
}
