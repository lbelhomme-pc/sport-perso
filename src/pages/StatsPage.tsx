import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { BarChart3, CalendarCheck, Dumbbell, Footprints, Scale, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ComparisonBarChart } from "../components/charts/ComparisonBarChart";
import { MetricBarChart } from "../components/charts/MetricBarChart";
import { MetricLineChart } from "../components/charts/MetricLineChart";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { getPlannedWeek } from "../data/trainingPlan";
import { useStoredData } from "../hooks/useStoredData";
import type { WeightEntry } from "../types";
import { estimateNeatCalories } from "../utils/calories";
import { formatShortDate, getTotalWeeks, getWeekStart, toISODate } from "../utils/dates";
import { getMealTotals } from "../utils/nutrition";
import { getAverageHeartRate, getAverageRpe, summarizeWeek } from "../utils/training";

function getBodyWeightForDate(weights: WeightEntry[], date: string, fallback: number): number {
  const previousWeight = [...weights]
    .filter((entry) => entry.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

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
  const totalWeeks = getTotalWeeks(data.settings.startDate, data.settings.targetDate);
  const weekSeries = Array.from({ length: totalWeeks }, (_, index) => {
    const week = index + 1;
    const plannedWeek = getPlannedWeek(data.settings, week, data.settings.badmintonVariant);
    const summary = summarizeWeek(week, getWeekStart(data.settings.startDate, week), plannedWeek, data.sessions);

    return {
      week: `S${week}`,
      volume: summary.volumeMin,
      calories: summary.sportCalories,
      planned: summary.planned,
      completed: summary.completed
    };
  });

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

  const totalSportCalories = data.sessions.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const totalRacket = data.sessions.filter((session) => session.type === "badminton" || session.type === "racket").length;
  const totalStrength = data.sessions.filter((session) => session.type === "strength").length;
  const totalSteps21Days = dailySeries.reduce((total, day) => total + day.steps, 0);
  const totalFloors21Days = dailySeries.reduce((total, day) => total + day.floors, 0);
  const totalNeat21Days = dailySeries.reduce((total, day) => total + day.neat, 0);
  const totalPlannedSessions = weekSeries.reduce((total, week) => total + week.planned, 0);
  const totalCompletedSessions = weekSeries.reduce((total, week) => total + week.completed, 0);
  const totalVolumeMinutes = weekSeries.reduce((total, week) => total + week.volume, 0);
  const totalFood21Days = dailySeries.reduce((total, day) => total + day.calories, 0);
  const totalProtein21Days = dailySeries.reduce((total, day) => total + day.protein, 0);
  const mealDaysCount = countUniqueDates(data.meals);
  const movementDaysCount = countUniqueDates(
    data.dailyContexts.filter((context) => (context.steps ?? 0) > 0 || (context.floors ?? 0) > 0)
  );
  const floorDaysCount = countUniqueDates(data.dailyContexts.filter((context) => (context.floors ?? 0) > 0));
  const sessionsWithCalories = data.sessions.filter((session) => (session.caloriesBurned ?? 0) > 0).length;
  const weightTrendReady = hasWeightTrend(data.weights);
  const sessionTrendReady = data.sessions.length >= 2;
  const sportCaloriesReady = sessionsWithCalories >= 2;
  const foodTrendReady = mealDaysCount >= 3;
  const movementTrendReady = movementDaysCount >= 3;
  const floorsTrendReady = floorDaysCount >= 2;
  const executionTrendReady = totalCompletedSessions > 0;
  const averageHeartRate = getAverageHeartRate(data.sessions);
  const averageRpe = getAverageRpe(data.sessions);
  const hasAnyMetricCard =
    data.sessions.length > 0 ||
    totalSportCalories > 0 ||
    totalFood21Days > 0 ||
    totalProtein21Days > 0 ||
    totalSteps21Days > 0 ||
    totalFloors21Days > 0 ||
    totalNeat21Days > 0 ||
    Boolean(averageHeartRate) ||
    Boolean(averageRpe);
  const hasUsefulStats =
    sessionTrendReady ||
    foodTrendReady ||
    weightTrendReady ||
    movementTrendReady ||
    sportCaloriesReady ||
    executionTrendReady;

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
            <ChartEmptyState
              icon={Dumbbell}
              title="Aucune séance enregistrée cette semaine"
              message="Ajoute 2 séances pour voir ton volume, ta régularité et les séances prévues vs réalisées."
              to="/sessions"
              actionLabel="Ajouter une séance"
            />
            <ChartEmptyState
              icon={Utensils}
              title="Pas encore de tendance nutrition"
              message="Ajoute 3 jours de repas pour voir les calories et les protéines évoluer sans graphique fantôme."
              to="/meals"
              actionLabel="Ajouter un repas"
            />
            <ChartEmptyState
              icon={Scale}
              title="Tendance poids en attente"
              message="Ajoute 2 pesées espacées de 7 jours pour afficher une tendance fiable plutôt qu'un bruit quotidien."
              to="/weight"
              actionLabel="Saisir le poids"
            />
            <ChartEmptyState
              icon={Footprints}
              title="Mouvement quotidien absent"
              message="Ajoute tes pas sur 3 jours pour voir la dépense NEAT estimée et les habitudes de mouvement."
              to="/meals"
              actionLabel="Saisir les pas"
            />
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
        description="Une vue large pour repérer ce qui monte, ce qui fatigue et ce qui nourrit vraiment ta progression, quel que soit le sport."
      />

      {hasAnyMetricCard ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.sessions.length ? <MetricCard label="Total séances" value={data.sessions.length} /> : null}
          {totalRacket ? <MetricCard label="Raquette" value={totalRacket} /> : null}
          {totalStrength ? <MetricCard label="Force" value={totalStrength} /> : null}
          {totalSportCalories ? <MetricCard label="Calories sport" value={totalSportCalories} /> : null}
          {totalFood21Days ? <MetricCard label="Calories repas 21 j" value={`${totalFood21Days} kcal`} /> : null}
          {totalProtein21Days ? <MetricCard label="Protéines 21 j" value={`${totalProtein21Days} g`} /> : null}
          {totalSteps21Days ? <MetricCard label="Pas 21 j" value={totalSteps21Days.toLocaleString("fr-FR")} /> : null}
          {totalFloors21Days ? <MetricCard label="Étages 21 j" value={totalFloors21Days.toLocaleString("fr-FR")} /> : null}
          {totalNeat21Days ? <MetricCard label="Mouvement 21 j" value={`${totalNeat21Days} kcal`} /> : null}
          {averageHeartRate ? <MetricCard label="Moyenne FC" value={averageHeartRate} /> : null}
          {averageRpe ? <MetricCard label="RPE moyen" value={averageRpe} /> : null}
        </section>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
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
              to="/meals"
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
              title="NEAT pas encore calculable"
              message="Ajoute tes pas, et si possible les étages, sur 3 jours pour afficher la dépense de mouvement."
              to="/meals"
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
              to="/meals"
              actionLabel="Saisir les étages"
            />
          )}
        </CollapsibleSectionCard>

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

        <CollapsibleSectionCard eyebrow="Réalisées vs prévues" title="Exécution semaine">
          {executionTrendReady ? (
            <ComparisonBarChart
              data={weekSeries}
              xKey="week"
              firstKey="planned"
              secondKey="completed"
              firstName="Prévues"
              secondName="Réalisées"
              summary={`${totalCompletedSessions} séances réalisées / ${totalPlannedSessions} prévues.`}
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
      </div>
    </>
  );
}
