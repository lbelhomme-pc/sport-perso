import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { BarChart3, CalendarCheck, Dumbbell, Flame, Footprints, HeartPulse, Scale, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ComparisonBarChart } from "../components/charts/ComparisonBarChart";
import { MetricBarChart } from "../components/charts/MetricBarChart";
import { MetricLineChart } from "../components/charts/MetricLineChart";
import { ProgressionSnapshot } from "../components/progress/ProgressionSnapshot";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { getPlannedWeek } from "../data/trainingPlan";
import { useStoredData } from "../hooks/useStoredData";
import { useUserModules } from "../hooks/useUserModules";
import { getSportProgressionSummary } from "../services/progressionService";
import type { CompletedSession, PlannedSession, WeightEntry } from "../types";
import { estimateNeatCalories } from "../utils/calories";
import { formatShortDate, getCurrentWeekIndex, getMonday, getTotalWeeks, getWeekStart, parseDate, toISODate } from "../utils/dates";
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

function formatCompactNumber(value: number) {
  return value.toLocaleString("fr-FR");
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(4, value));
}

function ProgressOverviewCard({
  days,
  volumeMin,
  volumeGoalMin,
  steps,
  calories,
  sessions
}: {
  days: Array<{ label: string; value: number; goal: number; isToday: boolean }>;
  volumeMin: number;
  volumeGoalMin: number;
  steps: number;
  calories: number;
  sessions: number;
}) {
  const maxValue = Math.max(...days.map((day) => day.value), ...days.map((day) => day.goal), 1);
  const completion = volumeGoalMin > 0 ? Math.round((volumeMin / volumeGoalMin) * 100) : 0;

  return (
    <section className="theme-stat-card overflow-hidden rounded-panel border p-5 shadow-panel sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="stat-muted text-sm font-black uppercase tracking-[0.18em]">Progression</p>
          <p className="mt-3 font-display text-5xl font-black tracking-[-0.08em] sm:text-6xl">
            {formatCompactNumber(volumeMin)}
            <span className="stat-muted ml-2 text-2xl">min</span>
          </p>
        </div>
        <div className="text-right">
          <p className="stat-muted text-[0.65rem] font-black uppercase tracking-[0.16em]">Objectif semaine</p>
          <p className="stat-accent mt-1 font-display text-2xl font-black tracking-[-0.05em]">{formatCompactNumber(volumeGoalMin)} min</p>
          <p className="stat-soft text-sm font-black">{completion} %</p>
        </div>
      </div>

      <div className="stat-muted mt-5 flex items-center gap-5 text-[0.68rem] font-black uppercase tracking-[0.16em]">
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
                    <span className="mx-auto mt-1 block w-fit bg-limeSoft px-1 text-[0.62rem] font-black text-petrol-900">{day.value}</span>
                  ) : null}
                </div>
              </div>
              <p className="stat-soft truncate text-center text-[0.65rem] font-black uppercase tracking-[0.08em]">{day.label}</p>
            </div>
          );
        })}
      </div>

      <div className="stat-divider grid grid-cols-3 divide-x border-b text-center">
        <div className="p-3">
          <p className="stat-soft text-[0.65rem] font-black uppercase tracking-[0.14em]">Pas</p>
          <p className="stat-accent mt-1 font-display text-xl font-black tracking-[-0.05em]">{formatCompactNumber(steps)}</p>
        </div>
        <div className="p-3">
          <p className="stat-soft text-[0.65rem] font-black uppercase tracking-[0.14em]">Calories</p>
          <p className="stat-accent mt-1 font-display text-xl font-black tracking-[-0.05em]">{formatCompactNumber(calories)}</p>
        </div>
        <div className="p-3">
          <p className="stat-soft text-[0.65rem] font-black uppercase tracking-[0.14em]">Séances</p>
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
};

function CompactSportRows({ rows }: { rows: CompactSportRow[] }) {
  if (!rows.length) return null;

  return (
    <section className="grid gap-3 sm:hidden">
      {rows.map((row) => {
        const Icon = row.icon;
        const maxValue = Math.max(...row.values, 1);

        return (
          <article key={row.id} className="theme-stat-card grid grid-cols-[minmax(0,1fr)_7.25rem] items-center gap-4 rounded-card border p-4 shadow-panel">
            <div className="min-w-0">
              <Icon className="h-5 w-5" style={{ color: row.color }} aria-hidden="true" />
              <p className="stat-soft mt-2 text-[0.68rem] font-black uppercase tracking-[0.15em]">{row.label}</p>
              <p className="mt-1 truncate font-display text-3xl font-black tracking-[-0.06em]">{row.value}</p>
              <p className="stat-soft mt-1 text-xs font-bold leading-5">{row.helper}</p>
            </div>

            <div className="stat-divider flex h-24 items-end justify-end gap-2 border-l pl-3" aria-hidden="true">
              {row.values.map((value, index) => {
                const height = value > 0 ? clampPercent((value / maxValue) * 100) : 9;

                return (
                  <span
                    key={`${row.id}-${index}`}
                    className="w-2 rounded-full"
                    style={{
                      height: `${height}%`,
                      backgroundColor: row.color,
                      opacity: value > 0 ? 1 : 0.18
                    }}
                  />
                );
              })}
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
    <div>
      <EmptyState icon={icon} title={title} message={message} />
      <Link to={to} className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-petrol-800/15 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">
        {actionLabel}
      </Link>
    </div>
  );
}

export default function StatsPage() {
  const data = useStoredData();
  const { isEnabled } = useUserModules();
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
      date: formatShortDate(date),
      calories: Math.round(totals.calories),
      steps,
      floors,
      neat,
      protein: Math.round(totals.protein)
    };
  });

  const weightSeries = data.weights.map((entry) => ({
    date: formatShortDate(entry.date),
    weight: entry.weight
  }));

  const sessionsWithCalories = data.sessions.filter((session) => session.completed && (session.caloriesBurned ?? 0) > 0);
  const totalSportCalories = sessionsWithCalories.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const stepContexts = data.dailyContexts.filter((context) => (context.steps ?? 0) > 0);
  const floorContexts = data.dailyContexts.filter((context) => (context.floors ?? 0) > 0);
  const showMovement = calendarEnabled || stepContexts.length > 0 || floorContexts.length > 0;
  const totalRecordedSteps = stepContexts.reduce((total, context) => total + (context.steps ?? 0), 0);
  const totalRecordedFloors = floorContexts.reduce((total, context) => total + (context.floors ?? 0), 0);
  const averageSportCaloriesPerSession = averageRounded(totalSportCalories, sessionsWithCalories.length);
  const averageSportCaloriesPerWeek = averageGroupedTotal(sessionsWithCalories, (session) => getWeekKey(session.date), (session) => session.caloriesBurned ?? 0);
  const averageSportCaloriesPerMonth = averageGroupedTotal(sessionsWithCalories, (session) => getMonthKey(session.date), (session) => session.caloriesBurned ?? 0);
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
  const sessionTrendReady = data.sessions.length >= 2;
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
          values: progressDays.map((day) => day.value)
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
          values: progressDays.map((day) => day.calories)
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
          values: progressDays.map((day) => day.steps)
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
          values: progressDays.map((day) => day.floors)
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
          values: progressHeartRateValues
        }
      : null
  ].filter((row): row is CompactSportRow => Boolean(row));
  const hasUsefulStats =
    (showSport && Boolean(currentWeekProgram?.planned)) ||
    (showSport && sessionTrendReady) ||
    (showNutritionNumbers && foodTrendReady) ||
    (showWeight && weightTrendReady) ||
    (showMovement && (movementTrendReady || stepContexts.length > 0 || floorContexts.length > 0)) ||
    (showSport && sportCaloriesReady) ||
    (showSport && sessionsWithCalories.length > 0) ||
    (showSport && executionTrendReady);
  const hasAverageCards =
    (showSport && averageSportCaloriesPerSession > 0) ||
    (showSport && averageSportCaloriesPerWeek > 0) ||
    (showSport && averageSportCaloriesPerMonth > 0) ||
    (showMovement && averageStepsPerDay > 0) ||
    (showMovement && averageStepsPerWeek > 0) ||
    (showMovement && averageStepsPerMonth > 0) ||
    (showMovement && averageFloorsPerDay > 0) ||
    (showMovement && averageFloorsPerWeek > 0) ||
    (showMovement && averageFloorsPerMonth > 0);

  if (!hasUsefulStats) {
    return (
      <>
        <PageHeader
          eyebrow="Progression"
          title="Tes tendances arrivent bientôt"
          description="On évite les graphiques vides : chaque bloc te dit quoi saisir pour faire apparaître une vraie tendance."
        />

        <SectionCard className="p-5 sm:p-6">
          <EmptyState
            icon={BarChart3}
            title="Pas encore assez de données"
            message="Commence par une ou deux actions simples. L'app affichera les tendances dès que les données deviennent utiles."
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
      <PageHeader
        eyebrow="Progression"
        title="Tendances"
        description="Synthèse claire, puis détails si besoin."
      />

      <ProgressOverviewCard
        days={progressDays}
        volumeMin={progressVolumeMin}
        volumeGoalMin={currentWeekVolumeGoal || progressDays.reduce((total, day) => total + day.goal, 0)}
        steps={progressSteps}
        calories={progressCalories}
        sessions={progressSessionCount}
      />

      <CompactSportRows rows={compactSportRows} />

      <section className="hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {showSport && currentWeekProgram?.planned ? (
          <MetricCard
            label="Programme"
            value={`${currentWeekProgram.completed}/${currentWeekProgram.planned}`}
            hint={`${currentWeekProgram.completionRate} % validé`}
            tone="lime"
          />
        ) : null}
        {showSport && data.sessions.length ? <MetricCard label="Séances totales" value={data.sessions.length} /> : null}
        {showSport && averageRpe ? <MetricCard label="RPE moyen" value={averageRpe} /> : null}
        {showSport && averageHeartRate ? <MetricCard label="FC moyenne" value={averageHeartRate} /> : null}
      </section>

      {hasAverageCards ? (
        <SectionCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Moyennes</p>
              <h2 className="title-lg mt-2">Pas, étages et calories</h2>
            </div>
            <span className="chip bg-limeSoft text-petrol-900">Visible directement</span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Calculé uniquement sur les séances ou journées renseignées. Une journée non saisie ne compte pas comme zéro.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {showMovement && averageStepsPerDay ? (
              <MetricCard label="Pas / jour" value={averageStepsPerDay.toLocaleString("fr-FR")} hint={`${stepContexts.length} jour${stepContexts.length > 1 ? "s" : ""} renseigné${stepContexts.length > 1 ? "s" : ""}`} tone="lime" />
            ) : null}
            {showMovement && averageStepsPerWeek ? (
              <MetricCard label="Pas / semaine" value={averageStepsPerWeek.toLocaleString("fr-FR")} hint="Semaines avec pas renseignés" />
            ) : null}
            {showMovement && averageStepsPerMonth ? (
              <MetricCard label="Pas / mois" value={averageStepsPerMonth.toLocaleString("fr-FR")} hint="Mois avec pas renseignés" />
            ) : null}
            {showMovement && averageFloorsPerDay ? (
              <MetricCard label="Étages / jour" value={averageFloorsPerDay.toLocaleString("fr-FR")} hint={`${floorContexts.length} jour${floorContexts.length > 1 ? "s" : ""} renseigné${floorContexts.length > 1 ? "s" : ""}`} tone="lime" />
            ) : null}
            {showMovement && averageFloorsPerWeek ? (
              <MetricCard label="Étages / semaine" value={averageFloorsPerWeek.toLocaleString("fr-FR")} hint="Semaines avec étages renseignés" />
            ) : null}
            {showMovement && averageFloorsPerMonth ? (
              <MetricCard label="Étages / mois" value={averageFloorsPerMonth.toLocaleString("fr-FR")} hint="Mois avec étages renseignés" />
            ) : null}
            {showSport && averageSportCaloriesPerSession ? (
              <MetricCard
                label="Calories / séance"
                value={`${averageSportCaloriesPerSession} kcal`}
                hint={`${sessionsWithCalories.length} séance${sessionsWithCalories.length > 1 ? "s" : ""} avec calories`}
              />
            ) : null}
            {showSport && averageSportCaloriesPerWeek ? (
              <MetricCard label="Calories / semaine" value={`${averageSportCaloriesPerWeek} kcal`} hint="Semaines avec sport renseigné" />
            ) : null}
            {showSport && averageSportCaloriesPerMonth ? (
              <MetricCard label="Calories / mois" value={`${averageSportCaloriesPerMonth} kcal`} hint="Mois avec sport renseigné" />
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {showSport ? (
        <CollapsibleSectionCard
          eyebrow="Progression sportive"
          title="PR et régularité"
          defaultOpen
        >
          <ProgressionSnapshot summary={progressionSummary} />
        </CollapsibleSectionCard>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {showSport ? (
          <>
            <CollapsibleSectionCard eyebrow="Volume hebdomadaire" title="Minutes par semaine">
              {sessionTrendReady && hasValue(weekSeries, "volume") ? (
                <MetricBarChart
                  data={weekSeries}
                  xKey="week"
                  yKey="volume"
                  suffix=" min"
                  summary={`${totalVolumeMinutes} min enregistrées sur le programme affiché.`}
                />
              ) : (
                <ChartEmptyState
                  icon={Dumbbell}
                  title="Ajoute 2 séances pour voir ton volume"
                  message="Le volume devient lisible quand tu as au moins deux séances enregistrées avec une durée."
                  to="/sessions"
                  actionLabel="Ajouter une séance"
                />
              )}
            </CollapsibleSectionCard>

            <CollapsibleSectionCard eyebrow="Calories sport" title="Dépense par semaine">
              {sportCaloriesReady && hasValue(weekSeries, "calories") ? (
                <MetricBarChart
                  data={weekSeries}
                  xKey="week"
                  yKey="calories"
                  color="#DCEFA3"
                  suffix=" kcal"
                  summary={`${totalSportCalories} kcal sport enregistrées au total.`}
                />
              ) : (
                <ChartEmptyState
                  icon={Dumbbell}
                  title="Calories sport en attente"
                  message="Ajoute les calories sur 2 séances pour voir une dépense hebdomadaire utile."
                  to="/sessions"
                  actionLabel="Compléter une séance"
                />
              )}
            </CollapsibleSectionCard>
          </>
        ) : null}

        {showNutritionNumbers ? (
          <>
            <CollapsibleSectionCard eyebrow="Calories alimentaires" title="21 derniers jours">
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
            </CollapsibleSectionCard>

            <CollapsibleSectionCard eyebrow="Protéines" title="21 derniers jours">
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
            </CollapsibleSectionCard>
          </>
        ) : null}

        {showMovement ? (
          <>
            <CollapsibleSectionCard eyebrow="Pas quotidiens" title="21 derniers jours">
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
            </CollapsibleSectionCard>

            <CollapsibleSectionCard eyebrow="Mouvement estimé" title="Calories via pas + étages">
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
            </CollapsibleSectionCard>

            <CollapsibleSectionCard eyebrow="Étages quotidiens" title="21 derniers jours">
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
            </CollapsibleSectionCard>
          </>
        ) : null}

        {showWeight ? (
          <CollapsibleSectionCard eyebrow="Poids" title="Courbe">
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
          </CollapsibleSectionCard>
        ) : null}

        {showSport ? (
          <CollapsibleSectionCard eyebrow="Réalisées vs prévues" title="Exécution semaine">
            {executionTrendReady ? (
              <ComparisonBarChart
                data={weekSeries}
                xKey="week"
                firstKey="planned"
                secondKey="completed"
                firstName="Prévues"
                secondName="Réalisées"
                summary={`${totalCompletedSessions} séances prévues validées / ${totalPlannedSessions} prévues. Une séance compte même si tu la fais un autre jour.`}
              />
            ) : (
              <ChartEmptyState
                icon={CalendarCheck}
                title="Aucune séance enregistrée cette semaine"
                message="Valide une séance du planning pour comparer ce qui était prévu avec ce qui a été fait."
                to="/planning"
                actionLabel="Voir le programme"
              />
            )}
          </CollapsibleSectionCard>
        ) : null}
      </div>
    </>
  );
}
