import { useEffect, useRef, useState } from "react";
import { Edit3, Plus, Trash2, Utensils } from "lucide-react";
import { MealForm } from "../components/forms/MealForm";
import { EmptyState } from "../components/ui/EmptyState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SectionCard } from "../components/ui/SectionCard";
import { ENERGY_LEVELS, MEAL_TYPE_LABELS } from "../data/defaults";
import { getPlannedWeek } from "../data/trainingPlan";
import { useDailyContext } from "../hooks/useDailyContext";
import { useMeals } from "../hooks/useMeals";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import { useWeight } from "../hooks/useWeight";
import type { Meal } from "../types";
import { getAdaptiveDailyCalorieTarget, getDailyDeficit, getRemainingCaloriesToTarget } from "../utils/calories";
import { formatLongDate, getWeekIndexForDate, toISODate } from "../utils/dates";
import { getMealTotals, getProteinTarget } from "../utils/nutrition";

function NutritionStat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-petrol-800/10 bg-white p-3">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{value}</p>
      {hint ? <p className="mt-1 text-xs font-bold text-muted">{hint}</p> : null}
    </div>
  );
}

function remainingLabel(value: number) {
  if (value >= 0) return `${Math.round(value)} kcal`;
  return `${Math.abs(Math.round(value))} kcal`;
}

function remainingHint(value: number) {
  return value >= 0 ? "reste avant l'objectif" : "au-dessus de l'objectif";
}

export default function MealsPage() {
  const { settings } = useSettings();
  const { meals, saveMeal, deleteMeal } = useMeals();
  const { sessions } = useSessions();
  const { weights } = useWeight();
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [editing, setEditing] = useState<Meal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { dailyContext, saveDailyContext } = useDailyContext(selectedDate);
  const formRef = useRef<HTMLDivElement>(null);
  const dayMeals = meals.filter((meal) => meal.date === selectedDate);
  const daySessions = sessions.filter((session) => session.date === selectedDate);
  const selectedWeek = getWeekIndexForDate(settings.startDate, settings.targetDate, selectedDate);
  const selectedPlannedSession = getPlannedWeek(settings, selectedWeek, "twoBadWedThu").find(
    (session) => session.date === selectedDate
  );
  const totals = getMealTotals(dayMeals);
  const latestWeight = weights[weights.length - 1]?.weight ?? settings.defaultBodyWeight;
  const proteinTarget = getProteinTarget(latestWeight, settings.proteinPerKg);
  const adaptiveCalorieTarget = getAdaptiveDailyCalorieTarget({
    settings,
    plannedSession: selectedPlannedSession,
    sessions: daySessions,
    energyLevel: dailyContext.energyLevel,
    steps: dailyContext.steps,
    bodyWeightKg: latestWeight
  });
  const dailyDeficit = getDailyDeficit(dayMeals, adaptiveCalorieTarget.maintenanceTarget);
  const remainingCalories = getRemainingCaloriesToTarget(dayMeals, adaptiveCalorieTarget.target);

  useEffect(() => {
    if (!showForm && !editing) return;

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [editing, showForm]);

  return (
    <>
      <section className="panel overflow-hidden">
        <div className="grid gap-0 xl:grid-cols-[0.65fr_1.35fr]">
          <div className="bg-petrol-800 p-5 text-white sm:p-6">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft">Journal alimentaire</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.07em]">Repas</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              Saisie et corrections ici. L'accueil reste la synthèse.
            </p>
            <button className="mt-5 w-full action-button bg-limeSoft text-petrol-900 hover:bg-white" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Ajouter repas
            </button>
          </div>

          <div className="grid gap-4 bg-white p-5 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-3">
              <label className="field-label">
                Jour
                <input className="field" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </label>
              <label className="field-label">
                Ressenti
                <select
                  className="field"
                  value={dailyContext.energyLevel}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: selectedDate,
                      energyLevel: event.target.value as typeof dailyContext.energyLevel
                    })
                  }
                >
                  {ENERGY_LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Pas réalisés
                <input
                  className="field"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={dailyContext.steps ? String(dailyContext.steps) : ""}
                  onChange={(event) =>
                    saveDailyContext({
                      ...dailyContext,
                      date: selectedDate,
                      steps: Number(event.target.value.replace(/\D/g, ""))
                    })
                  }
                  placeholder="Ex : 8500"
                />
              </label>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className={remainingCalories >= 0 ? "bg-limeSoft p-4 text-petrol-900" : "bg-red-50 p-4 text-red-950"}>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                  {remainingCalories >= 0 ? "Reste à manger" : "Objectif dépassé"}
                </p>
                <p className="mt-2 font-display text-4xl font-black tracking-[-0.08em]">{remainingLabel(remainingCalories)}</p>
                <p className="mt-1 text-sm font-bold opacity-75">{remainingHint(remainingCalories)}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <NutritionStat label="Mangé" value={Math.round(totals.calories)} hint={`/ ${adaptiveCalorieTarget.target} kcal`} />
                <NutritionStat label="Déficit réel" value={`${dailyDeficit} kcal`} hint={`cible ${settings.targetDailyDeficit} kcal`} />
                <NutritionStat label="Protéines" value={`${Math.round(totals.protein)} g`} hint={`/ ${proteinTarget} g`} />
                <NutritionStat label="NEAT pas" value={`${adaptiveCalorieTarget.neatCalories} kcal`} hint={`${dailyContext.steps ?? 0} pas`} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
              <span className="chip">Glucides {Math.round(totals.carbs)} g</span>
              <span className="chip">Lipides {Math.round(totals.fat)} g</span>
              <span className="chip">BMR {adaptiveCalorieTarget.base} kcal</span>
              <span className="chip">Objectif {adaptiveCalorieTarget.target} kcal</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProgressBar label="Calories consommées" value={totals.calories} max={adaptiveCalorieTarget.target} />
              <ProgressBar label="Protéines quotidiennes" value={totals.protein} max={proteinTarget} tone="lime" />
            </div>
            <p className="text-xs font-bold text-muted">
              Calcul simple : BMR {adaptiveCalorieTarget.base} + activité {adaptiveCalorieTarget.activityFuel} + pas{" "}
              {adaptiveCalorieTarget.neatCalories} + ressenti {adaptiveCalorieTarget.feelingFuel} - déficit{" "}
              {adaptiveCalorieTarget.targetDeficit} = objectif à manger {adaptiveCalorieTarget.target} kcal. Déficit réel : dépense estimée{" "}
              {adaptiveCalorieTarget.maintenanceTarget} - mangé {Math.round(totals.calories)} = {dailyDeficit} kcal.
            </p>
          </div>
        </div>
      </section>

      {showForm || editing ? (
        <div ref={formRef}>
          <SectionCard className="p-5 sm:p-6">
            <p className="eyebrow">{editing ? "Modifier" : "Ajout rapide"}</p>
            <h2 className="title-lg mt-2">{editing ? editing.name : "Nouveau repas"}</h2>
            <div className="mt-5">
              <MealForm
                initial={editing ?? { date: selectedDate }}
                onCancel={() => {
                  setEditing(null);
                  setShowForm(false);
                }}
                onSubmit={(meal) => {
                  saveMeal(meal);
                  setSelectedDate(meal.date);
                  setEditing(null);
                  setShowForm(false);
                }}
              />
            </div>
          </SectionCard>
        </div>
      ) : null}

      <SectionCard className="p-5 sm:p-6">
        <p className="eyebrow">{formatLongDate(selectedDate)}</p>
        <h2 className="title-lg mt-2">Repas du jour</h2>

        <div className="mt-5 grid gap-3">
          {dayMeals.length ? (
            dayMeals.map((meal) => (
              <article key={meal.id} className="border border-petrol-800/10 bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="chip">{MEAL_TYPE_LABELS[meal.mealType]}</span>
                    <h3 className="mt-3 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{meal.name}</h3>
                    {meal.items?.length ? (
                      <div className="mt-2 grid gap-2">
                        {meal.items.map((item) => (
                          <div key={item.id} className="border-l-4 border-limeSoft bg-mist/45 px-3 py-2">
                            <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">
                              Aliment - {item.quantityGrams} g
                            </p>
                            <p className="text-sm font-black text-petrol-800">{item.foodName}</p>
                            <p className="text-xs font-bold text-muted">
                              {item.calories} kcal - P {item.protein} g | G {item.carbs} g | L {item.fat} g
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : meal.foodName ? (
                      <div className="mt-2 border-l-4 border-limeSoft bg-mist/45 px-3 py-2">
                        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">Aliment</p>
                        <p className="text-sm font-black text-petrol-800">{meal.foodName}</p>
                        {meal.brand ? <p className="text-xs font-bold text-muted">{meal.brand}</p> : null}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">{meal.calories} kcal</span>
                      <span className="chip">{meal.protein} g prot.</span>
                      <span className="chip">{meal.carbs} g gluc.</span>
                      <span className="chip">{meal.fat} g lip.</span>
                      {meal.quantityGrams ? <span className="chip">{meal.quantityGrams} g</span> : null}
                      {meal.source === "openfoodfacts" ? <span className="chip bg-limeSoft">Open Food Facts</span> : null}
                      {meal.source === "common" ? <span className="chip bg-limeSoft">Aliment simple</span> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="ghost-button" onClick={() => setEditing(meal)} aria-label="Modifier le repas">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        if (window.confirm("Supprimer ce repas ?")) deleteMeal(meal.id);
                      }}
                      aria-label="Supprimer le repas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {meal.notes ? <p className="mt-4 border-l-4 border-limeSoft bg-mist/50 p-4 text-sm font-semibold text-ink">{meal.notes}</p> : null}
              </article>
            ))
          ) : (
            <EmptyState icon={Utensils} title="Aucun repas ce jour" message="Ajoute un repas en un tap, même approximatif. L'approximation suivie bat le parfait oublié." />
          )}
        </div>
      </SectionCard>
    </>
  );
}
