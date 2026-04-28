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

function signedCalories(value: number) {
  return value > 0 ? `+${Math.round(value)} kcal` : `${Math.round(value)} kcal`;
}

function balanceLabel(deficit: number) {
  return deficit >= 0 ? `${Math.round(deficit)} kcal` : `+${Math.abs(Math.round(deficit))} kcal`;
}

function balanceTitle(deficit: number) {
  return deficit >= 0 ? "Déficit réel" : "Surplus réel";
}

function balanceHint(deficit: number, targetDeficit: number) {
  return deficit >= 0 ? `cible ${targetDeficit} kcal` : "mangé au-dessus de la dépense estimée";
}

function nutritionCardTitle(remaining: number, deficit: number) {
  if (remaining >= 0) return "Reste à manger";
  return deficit >= 0 ? "Déficit réduit" : "Surplus réel";
}

function nutritionCardValue(remaining: number, deficit: number) {
  if (remaining >= 0) return `${Math.round(remaining)} kcal`;
  if (deficit < 0) return `+${Math.abs(Math.round(deficit))} kcal`;
  return `${Math.abs(Math.round(remaining))} kcal`;
}

function nutritionCardHint(remaining: number, deficit: number, targetDeficit: number) {
  if (remaining >= 0) return "avant la cible de déficit";
  if (deficit < 0) {
    return `${Math.abs(Math.round(remaining))} kcal au-dessus de la cible à manger`;
  }
  return `déficit réel ${Math.round(deficit)} kcal / cible ${targetDeficit} kcal`;
}

function balanceFormulaSentence(deficit: number, maintenanceTarget: number, eaten: number) {
  if (deficit >= 0) {
    return `Déficit réel : dépense estimée ${maintenanceTarget} - mangé ${eaten} = ${Math.round(deficit)} kcal.`;
  }

  return `Surplus réel : mangé ${eaten} - dépense estimée ${maintenanceTarget} = +${Math.abs(Math.round(deficit))} kcal.`;
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
  const selectedPlannedSession = getPlannedWeek(settings, selectedWeek, settings.badmintonVariant).find(
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
    floors: dailyContext.floors,
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
            <div className="grid gap-3 lg:grid-cols-[0.85fr_0.85fr_1.3fr]">
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
              <div className="field-label">
                Mouvement
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Pas</span>
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
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Étages</span>
                    <input
                      className="field"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={dailyContext.floors ? String(dailyContext.floors) : ""}
                      onChange={(event) =>
                        saveDailyContext({
                          ...dailyContext,
                          date: selectedDate,
                          floors: Number(event.target.value.replace(/\D/g, ""))
                        })
                      }
                      placeholder="Ex : 8"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className={remainingCalories >= 0 ? "bg-limeSoft p-4 text-petrol-900" : "bg-red-50 p-4 text-red-950"}>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                  {nutritionCardTitle(remainingCalories, dailyDeficit)}
                </p>
                <p className="mt-2 font-display text-4xl font-black tracking-[-0.08em]">
                  {nutritionCardValue(remainingCalories, dailyDeficit)}
                </p>
                <p className="mt-1 text-sm font-bold opacity-75">
                  {nutritionCardHint(remainingCalories, dailyDeficit, settings.targetDailyDeficit)}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <NutritionStat label="Mangé" value={Math.round(totals.calories)} hint={`/ ${adaptiveCalorieTarget.target} kcal`} />
                <NutritionStat
                  label={balanceTitle(dailyDeficit)}
                  value={balanceLabel(dailyDeficit)}
                  hint={balanceHint(dailyDeficit, settings.targetDailyDeficit)}
                />
                <NutritionStat label="Protéines" value={`${Math.round(totals.protein)} g`} hint={`/ ${proteinTarget} g`} />
                <NutritionStat
                  label="NEAT bas"
                  value={`${adaptiveCalorieTarget.neatCalories} kcal`}
                  hint={`${dailyContext.steps ?? 0} pas + ${dailyContext.floors ?? 0} étages`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
              <span className="chip">Glucides {Math.round(totals.carbs)} g</span>
              <span className="chip">Lipides {Math.round(totals.fat)} g</span>
              <span className="chip">Dépense totale {adaptiveCalorieTarget.maintenanceTarget} kcal</span>
              <span className="chip">Cible à manger {adaptiveCalorieTarget.target} kcal</span>
            </div>

            <div className="grid gap-2 border border-petrol-800/10 bg-mist/45 p-3 text-sm font-bold sm:grid-cols-3">
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">BMR</p>
                <p className="mt-1 text-petrol-800">{adaptiveCalorieTarget.base} kcal</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">EAT / sport</p>
                <p className="mt-1 text-petrol-800">{signedCalories(adaptiveCalorieTarget.activityFuel)}</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">NEAT</p>
                <p className="mt-1 text-petrol-800">
                  {adaptiveCalorieTarget.neatCalories} kcal
                  <span className="text-muted"> ({adaptiveCalorieTarget.stepsNeatCalories} pas + {adaptiveCalorieTarget.floorsNeatCalories} étages)</span>
                </p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Ressenti</p>
                <p className="mt-1 text-petrol-800">{signedCalories(adaptiveCalorieTarget.feelingFuel)}</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Total dépensé</p>
                <p className="mt-1 text-petrol-800">{adaptiveCalorieTarget.maintenanceTarget} kcal</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">{balanceTitle(dailyDeficit)}</p>
                <p className="mt-1 text-petrol-800">{balanceLabel(dailyDeficit)}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProgressBar label="Calories consommées" value={totals.calories} max={adaptiveCalorieTarget.target} />
              <ProgressBar label="Protéines quotidiennes" value={totals.protein} max={proteinTarget} tone="lime" />
            </div>
            <p className="text-xs font-bold text-muted">
              Calcul simple : BMR {adaptiveCalorieTarget.base} + sport validé {adaptiveCalorieTarget.activityFuel} + pas{" "}
              {adaptiveCalorieTarget.stepsNeatCalories} + étages {adaptiveCalorieTarget.floorsNeatCalories} + ressenti {adaptiveCalorieTarget.feelingFuel} - déficit{" "}
              {adaptiveCalorieTarget.targetDeficit} = cible à manger {adaptiveCalorieTarget.target} kcal.{" "}
              {balanceFormulaSentence(dailyDeficit, adaptiveCalorieTarget.maintenanceTarget, Math.round(totals.calories))}
            </p>
          </div>
        </div>
      </section>

      {showForm || editing ? (
        <div ref={formRef}>
          <SectionCard className="p-5 sm:p-6">
            <p className="eyebrow">{editing ? "Modifier" : "Ajout rapide"}</p>
            <h2 className="title-lg mt-2">{editing ? MEAL_TYPE_LABELS[editing.mealType] : "Nouveau repas"}</h2>
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
                    <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{MEAL_TYPE_LABELS[meal.mealType]}</h3>
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
