import { addDays, subDays } from "date-fns";
import { BarChart3 } from "lucide-react";
import { ComparisonBarChart } from "../components/charts/ComparisonBarChart";
import { MetricBarChart } from "../components/charts/MetricBarChart";
import { MetricLineChart } from "../components/charts/MetricLineChart";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { getPlannedWeek } from "../data/trainingPlan";
import { useStoredData } from "../hooks/useStoredData";
import type { WeightEntry } from "../types";
import { estimateNeatCalories } from "../utils/calories";
import { getTotalWeeks, getWeekStart, toISODate, formatShortDate } from "../utils/dates";
import { getMealTotals } from "../utils/nutrition";
import { getAverageHeartRate, getAverageRpe, summarizeWeek } from "../utils/training";

function getBodyWeightForDate(weights: WeightEntry[], date: string, fallback: number): number {
  const previousWeight = [...weights]
    .filter((entry) => entry.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return previousWeight?.weight ?? fallback;
}

export default function StatsPage() {
  const data = useStoredData();
  const totalWeeks = getTotalWeeks(data.settings.startDate, data.settings.targetDate);
  const weekSeries = Array.from({ length: totalWeeks }, (_, index) => {
    const week = index + 1;
    const plannedWeek = getPlannedWeek(data.settings, week, "twoBadWedThu");
    const summary = summarizeWeek(week, getWeekStart(data.settings.startDate, week), plannedWeek, data.sessions);

    return {
      week: `S${week}`,
      volume: summary.volumeMin,
      calories: summary.sportCalories,
      prévues: summary.planned,
      réalisées: summary.completed
    };
  });

  const startDaily = subDays(new Date(), 20);
  const dailySeries = Array.from({ length: 21 }, (_, index) => {
    const date = toISODate(addDays(startDaily, index));
    const totals = getMealTotals(data.meals.filter((meal) => meal.date === date));
    const context = data.dailyContexts.find((item) => item.date === date);
    const pas = context?.steps ?? 0;
    const etages = context?.floors ?? 0;
    const bodyWeight = getBodyWeightForDate(data.weights, date, data.settings.defaultBodyWeight);
    const neat = estimateNeatCalories(pas, etages, bodyWeight);

    return {
      date: formatShortDate(date),
      calories: Math.round(totals.calories),
      pas,
      etages,
      neat,
      protéines: Math.round(totals.protein)
    };
  });

  const weightSeries = data.weights.map((entry) => ({
    date: formatShortDate(entry.date),
    poids: entry.weight
  }));

  const totalSportCalories = data.sessions.reduce((total, session) => total + (session.caloriesBurned ?? 0), 0);
  const totalBadminton = data.sessions.filter((session) => session.type === "badminton").length;
  const totalStrength = data.sessions.filter((session) => session.type === "strength").length;
  const totalSteps21Days = dailySeries.reduce((total, day) => total + day.pas, 0);
  const totalFloors21Days = dailySeries.reduce((total, day) => total + day.etages, 0);
  const totalNeat21Days = dailySeries.reduce((total, day) => total + day.neat, 0);

  return (
    <>
      <PageHeader
        eyebrow="Statistiques"
        title="Tendances"
        description="Une vue large pour repérer ce qui monte, ce qui fatigue et ce qui nourrit vraiment la préparation."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-9">
        <MetricCard label="Total séances" value={data.sessions.length} />
        <MetricCard label="Badminton" value={totalBadminton} />
        <MetricCard label="Salle force" value={totalStrength} />
        <MetricCard label="Calories sport" value={totalSportCalories} />
        <MetricCard label="Pas 21 j" value={totalSteps21Days.toLocaleString("fr-FR")} />
        <MetricCard label="Étages 21 j" value={totalFloors21Days.toLocaleString("fr-FR")} />
        <MetricCard label="NEAT 21 j" value={`${totalNeat21Days} kcal`} />
        <MetricCard label="Moyenne FC" value={getAverageHeartRate(data.sessions) || "—"} />
        <MetricCard label="RPE moyen" value={getAverageRpe(data.sessions) || "—"} />
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Volume hebdomadaire</p>
          <h2 className="title-lg mt-2">Minutes par semaine</h2>
          <MetricBarChart data={weekSeries} xKey="week" yKey="volume" suffix=" min" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Calories sport</p>
          <h2 className="title-lg mt-2">Dépense par semaine</h2>
          <MetricBarChart data={weekSeries} xKey="week" yKey="calories" color="#DCEFA3" suffix=" kcal" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Calories alimentaires</p>
          <h2 className="title-lg mt-2">21 derniers jours</h2>
          <MetricLineChart data={dailySeries} xKey="date" yKey="calories" suffix=" kcal" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Protéines</p>
          <h2 className="title-lg mt-2">21 derniers jours</h2>
          <MetricLineChart data={dailySeries} xKey="date" yKey="protéines" color="#0A4B61" suffix=" g" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Pas quotidiens</p>
          <h2 className="title-lg mt-2">21 derniers jours</h2>
          <MetricBarChart data={dailySeries} xKey="date" yKey="pas" color="#0A4B61" suffix=" pas" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">NEAT estimé</p>
          <h2 className="title-lg mt-2">Calories via pas + étages</h2>
          <MetricLineChart data={dailySeries} xKey="date" yKey="neat" color="#DCEFA3" suffix=" kcal" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Étages quotidiens</p>
          <h2 className="title-lg mt-2">21 derniers jours</h2>
          <MetricBarChart data={dailySeries} xKey="date" yKey="etages" color="#DCEFA3" suffix=" étages" />
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Poids</p>
          <h2 className="title-lg mt-2">Courbe</h2>
          {weightSeries.length ? (
            <MetricLineChart data={weightSeries} xKey="date" yKey="poids" suffix=" kg" />
          ) : (
            <EmptyState icon={BarChart3} title="Pas encore de poids" message="Ajoute quelques entrées pour voir la tendance." />
          )}
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Réalisées vs prévues</p>
          <h2 className="title-lg mt-2">Exécution semaine</h2>
          <ComparisonBarChart
            data={weekSeries}
            xKey="week"
            firstKey="prévues"
            secondKey="réalisées"
            firstName="Prévues"
            secondName="Réalisées"
          />
        </SectionCard>
      </div>
    </>
  );
}
