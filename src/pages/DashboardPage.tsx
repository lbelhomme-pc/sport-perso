import { Link } from "react-router-dom";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { BarChart3, CalendarCheck2, CalendarDays, Dumbbell, Scale, Settings, Utensils } from "lucide-react";
import { MetricCard } from "../components/ui/MetricCard";
import { SectionCard } from "../components/ui/SectionCard";
import { EVENT_LABEL } from "../data/defaults";
import { getDisplayedVersion } from "../data/trainingPlan";
import { useDashboard } from "../hooks/useDashboard";
import { DAILY_HABIT_LABELS, useDailyHabits } from "../hooks/useDailyHabits";
import type { DailyHabitType } from "../types";
import { formatLongDate, formatShortDate } from "../utils/dates";
import { getProteinTarget } from "../utils/nutrition";

function remainingLabel(value: number) {
  if (value >= 0) return `${Math.round(value)} kcal`;
  return `${Math.abs(Math.round(value))} kcal`;
}

function remainingHint(value: number) {
  return value >= 0 ? "encore possible aujourd'hui" : "au-dessus de l'objectif";
}

function remainingSentence(value: number) {
  return value >= 0
    ? `il reste ${Math.round(value)} kcal avant l'objectif à manger`
    : `tu es ${Math.abs(Math.round(value))} kcal au-dessus de l'objectif à manger`;
}

function signedCalories(value: number) {
  return value > 0 ? `+${Math.round(value)} kcal` : `${Math.round(value)} kcal`;
}

function CompactStat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-petrol-800/10 bg-white p-3">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{value}</p>
      {hint ? <p className="mt-1 text-xs font-bold text-muted">{hint}</p> : null}
    </div>
  );
}

function alertClass(tone: string) {
  if (tone === "danger") return "border-red-300 bg-red-50 text-red-950";
  if (tone === "warning") return "border-amber-300 bg-amber-50 text-amber-950";
  if (tone === "success") return "border-limeSoft bg-limeSoft/50 text-petrol-900";
  return "border-mist bg-white text-ink";
}

function DashboardLink({
  to,
  icon: Icon,
  label,
  hint
}: {
  to: string;
  icon: typeof CalendarDays;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="group border border-petrol-800/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-petrol-800/25"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center bg-petrol-800 text-limeSoft">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.1em] text-petrol-800">{label}</p>
          <p className="mt-1 text-xs font-bold text-muted">{hint}</p>
        </div>
      </div>
    </Link>
  );
}

function VisualReminderCard({
  tone,
  title,
  message,
  to
}: {
  tone: "danger" | "warning";
  title: string;
  message: string;
  to: string;
}) {
  const className =
    tone === "danger"
      ? "border-red-300 bg-red-50 text-red-950"
      : "border-amber-300 bg-amber-50 text-amber-950";

  return (
    <Link to={to} className={`block border p-4 shadow-soft ${className}`}>
      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">Rappel visuel</p>
      <h3 className="mt-2 font-display text-2xl font-black tracking-[-0.05em]">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 opacity-80">{message}</p>
    </Link>
  );
}

function DailyHabitCheck({
  type,
  date,
  checked,
  onToggle
}: {
  type: DailyHabitType;
  date: string;
  checked: boolean;
  onToggle: (date: string, type: DailyHabitType, checked: boolean) => void;
}) {
  return (
    <label className={`flex min-h-14 items-center justify-between gap-3 border p-3 ${checked ? "border-limeSoft bg-limeSoft/70" : "border-petrol-800/10 bg-mist/50"}`}>
      <span>
        <span className="block text-sm font-black uppercase tracking-[0.1em] text-petrol-800">{DAILY_HABIT_LABELS[type]}</span>
        <span className="text-xs font-bold text-muted">{checked ? "Coché aujourd'hui" : "À faire / vérifier"}</span>
      </span>
      <input
        className="h-6 w-6 shrink-0 accent-petrol-800"
        type="checkbox"
        checked={checked}
        onChange={(event) => onToggle(date, type, event.target.checked)}
      />
    </label>
  );
}

export default function DashboardPage() {
  const dashboard = useDashboard();
  const { getHabit, toggleHabit } = useDailyHabits(dashboard.today);
  const steps = dashboard.todayContext?.steps ?? 0;
  const proteinTarget = getProteinTarget(dashboard.calculationWeight, dashboard.settings.proteinPerKg);
  const weightAgeDays = dashboard.latestWeight
    ? differenceInCalendarDays(parseISO(dashboard.today), parseISO(dashboard.latestWeight.date))
    : null;
  const visualReminders = [
    !dashboard.todayMeals.length
      ? {
          tone: "danger" as const,
          title: "Repas non saisi",
          message: "Ajoute au moins un repas ou une estimation rapide pour que le déficit reste lisible.",
          to: "/meals"
        }
      : null,
    !dashboard.latestWeight
      ? {
          tone: "warning" as const,
          title: "Poids absent",
          message: "Ajoute une première pesée pour fiabiliser le calcul BMR, protéines et tendance.",
          to: "/weight"
        }
      : weightAgeDays !== null && weightAgeDays >= 7
        ? {
            tone: "warning" as const,
            title: "Poids à rafraîchir",
            message: `Dernière pesée il y a ${weightAgeDays} jours. Une pesée récente rend le suivi plus propre.`,
            to: "/weight"
          }
        : null,
    dashboard.todayMeals.length && dashboard.todayMealTotals.protein < proteinTarget * 0.75
      ? {
          tone: "warning" as const,
          title: "Protéines basses",
          message: `Tu es à ${Math.round(dashboard.todayMealTotals.protein)} g / ${proteinTarget} g. Vise une prise simple au prochain repas.`,
          to: "/meals"
        }
      : null
  ].filter((reminder): reminder is { tone: "danger" | "warning"; title: string; message: string; to: string } =>
    Boolean(reminder)
  );
  const completion =
    dashboard.weekSummary.planned > 0
      ? Math.round((dashboard.weekSummary.completed / dashboard.weekSummary.planned) * 100)
      : 0;

  return (
    <>
      <section className="panel overflow-hidden">
        <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-petrol-800 p-6 text-white sm:p-8">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-limeSoft">{EVENT_LABEL}</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.9] tracking-[-0.08em] sm:text-6xl">
              Synthèse HYROX
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white/70">
              Résumé lisible : ce qu'il reste à manger, le calcul calories, la séance du jour et la semaine. Les modifications se font via le menu.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <div className="bg-white/10 p-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-white/60">Semaine</p>
                <p className="mt-1 font-display text-3xl font-black">{dashboard.currentWeek}</p>
              </div>
              <div className="bg-white/10 p-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-white/60">HYROX</p>
                <p className="mt-1 font-display text-3xl font-black">{formatShortDate(dashboard.settings.targetDate)}</p>
              </div>
              <div className="bg-white/10 p-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-white/60">Poids utilisé</p>
                <p className="mt-1 font-display text-3xl font-black">{dashboard.calculationWeight} kg</p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/50">
                  {dashboard.latestWeight ? formatShortDate(dashboard.latestWeight.date) : "par défaut"}
                </p>
              </div>
              <div className="bg-limeSoft p-3 text-petrol-900">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] opacity-70">Séances</p>
                <p className="mt-1 font-display text-3xl font-black">{completion}%</p>
              </div>
            </div>
          </div>

          <div className="grid content-between gap-4 bg-white p-6 sm:p-8">
            <div>
              <p className="eyebrow">Aujourd'hui</p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-muted">
                {formatLongDate(dashboard.today)}
              </p>
              <h2 className="mt-3 font-display text-4xl font-black tracking-[-0.06em] text-petrol-800">
                {dashboard.todayPlanned?.title ?? "Repos / libre"}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                {dashboard.todayPlanned
                  ? getDisplayedVersion(dashboard.todayPlanned, "normal")
                  : "Aucune séance prévue aujourd'hui. Garde le cap avec nutrition, pas et récupération."}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <DashboardLink to="/planning" icon={CalendarDays} label="Planning" hint="Voir et enregistrer" />
              <DashboardLink to="/meals" icon={Utensils} label="Repas" hint="Calories, pas, favoris" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <DailyHabitCheck type="allergies" date={dashboard.today} checked={getHabit(dashboard.today, "allergies")} onToggle={toggleHabit} />
              <DailyHabitCheck type="duolingo" date={dashboard.today} checked={getHabit(dashboard.today, "duolingo")} onToggle={toggleHabit} />
              <DailyHabitCheck type="omega3" date={dashboard.today} checked={getHabit(dashboard.today, "omega3")} onToggle={toggleHabit} />
              <DailyHabitCheck type="creatine" date={dashboard.today} checked={getHabit(dashboard.today, "creatine")} onToggle={toggleHabit} />
            </div>
          </div>
        </div>
      </section>

      {visualReminders.length ? (
        <section className="grid gap-3 lg:grid-cols-3">
          {visualReminders.map((reminder) => (
            <VisualReminderCard key={reminder.title} {...reminder} />
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Nutrition aujourd'hui</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className={dashboard.remainingCalories >= 0 ? "bg-limeSoft p-5 text-petrol-900" : "bg-red-50 p-5 text-red-950"}>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                {dashboard.remainingCalories >= 0 ? "Reste à manger" : "Objectif dépassé"}
              </p>
              <p className="mt-2 font-display text-5xl font-black tracking-[-0.08em]">{remainingLabel(dashboard.remainingCalories)}</p>
              <p className="mt-2 text-sm font-bold opacity-75">{remainingHint(dashboard.remainingCalories)}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <CompactStat label="Mangé" value={Math.round(dashboard.todayMealTotals.calories)} hint={`/ ${dashboard.adaptiveCalorieTarget.target} kcal`} />
              <CompactStat label="Déficit réel" value={`${dashboard.dailyDeficit} kcal`} hint={`cible ${dashboard.settings.targetDailyDeficit} kcal`} />
              <CompactStat label="Protéines" value={`${Math.round(dashboard.todayMealTotals.protein)} g`} hint="aujourd'hui" />
              <CompactStat label="Sport" value={`${Math.round(dashboard.todaySportCalories)} kcal`} hint="séances saisies" />
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-muted">
            Objectif à manger : {dashboard.adaptiveCalorieTarget.target} kcal. {remainingSentence(dashboard.remainingCalories)}.
          </p>
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Calcul simple</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.06em] text-petrol-800">
            Dépense estimée : {dashboard.adaptiveCalorieTarget.maintenanceTarget} kcal
          </h2>
          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between border-b border-petrol-800/10 py-2 text-sm font-bold">
              <span className="text-muted">Métabolisme basal</span>
              <span>{dashboard.adaptiveCalorieTarget.base} kcal</span>
            </div>
            <div className="flex items-center justify-between border-b border-petrol-800/10 py-2 text-sm font-bold">
              <span className="text-muted">Activité</span>
              <span>{signedCalories(dashboard.adaptiveCalorieTarget.activityFuel)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-petrol-800/10 py-2 text-sm font-bold">
              <span className="text-muted">Pas + ressenti</span>
              <span>{signedCalories(dashboard.adaptiveCalorieTarget.neatCalories + dashboard.adaptiveCalorieTarget.feelingFuel)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-petrol-800/10 py-2 text-sm font-bold">
              <span className="text-muted">Déficit cible</span>
              <span>-{dashboard.adaptiveCalorieTarget.targetDeficit} kcal</span>
            </div>
            <div className="flex items-center justify-between bg-mist/60 p-3 text-sm font-black text-petrol-800">
              <span>Objectif à manger</span>
              <span>{dashboard.adaptiveCalorieTarget.target} kcal</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold leading-5 text-muted">
            Poids utilisé : {dashboard.calculationWeight} kg. Pas : {steps}. NEAT bas estimé : {dashboard.adaptiveCalorieTarget.neatCalories} kcal.
          </p>
        </SectionCard>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard dark className="p-5 sm:p-6">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Alerte intelligente</p>
          <div className="mt-4 grid gap-3">
            {dashboard.alerts.map((alert) => (
              <article key={alert.id} className={`border p-4 ${alertClass(alert.tone)}`}>
                <h3 className="font-display text-xl font-black tracking-[-0.04em]">{alert.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 opacity-80">{alert.message}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Résumé semaine {dashboard.currentWeek}</p>
              <h2 className="title-lg mt-2">Volume et exécution</h2>
            </div>
            <div className="chip">
              {dashboard.weekSummary.completed}/{dashboard.weekSummary.planned} séances réalisées
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Badminton" value={dashboard.weekSummary.badminton} />
            <MetricCard label="Salle force" value={dashboard.weekSummary.strength} />
            <MetricCard label="Volume total" value={`${dashboard.weekSummary.volumeMin} min`} />
            <MetricCard label="Calories sport" value={dashboard.weekSummary.sportCalories} />
            <MetricCard label="Calories repas" value={Math.round(dashboard.weekMealTotals.calories)} />
            <MetricCard label="Protéines" value={`${Math.round(dashboard.weekMealTotals.protein)} g`} />
          </div>
        </SectionCard>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <DashboardLink to="/calendar" icon={CalendarCheck2} label="Calendrier" hint="Habitudes et sport" />
        <DashboardLink to="/sessions" icon={Dumbbell} label="Séances" hint="Ajouter ou corriger" />
        <DashboardLink to="/meals" icon={Utensils} label="Repas" hint="Modifier les aliments" />
        <DashboardLink to="/weight" icon={Scale} label="Poids" hint="Saisir une pesée" />
        <DashboardLink to="/stats" icon={BarChart3} label="Statistiques" hint="Voir les tendances" />
        <DashboardLink to="/settings" icon={Settings} label="Réglages" hint="Objectifs et export" />
      </section>
    </>
  );
}
