import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Edit3, Plus, Star, Trash2, Utensils } from "lucide-react";
import { MealForm } from "../components/forms/MealForm";
import { EmptyState } from "../components/ui/EmptyState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SectionCard } from "../components/ui/SectionCard";
import { MEAL_TYPE_LABELS } from "../data/defaults";
import { getPlannedWeek } from "../data/trainingPlan";
import { useDailyContext } from "../hooks/useDailyContext";
import { useFavoriteMeals } from "../hooks/useFavoriteMeals";
import { useMeals } from "../hooks/useMeals";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import { useWeight } from "../hooks/useWeight";
import { makeId } from "../services/storageService";
import type { CompletedSession, Meal, PlannedSession } from "../types";
import { getAdaptiveDailyCalorieTarget, getDailyDeficit, getRemainingCaloriesToTarget } from "../utils/calories";
import { formatLongDate, getWeekIndexForDate, toISODate } from "../utils/dates";
import { getMealTotals, getProteinTarget } from "../utils/nutrition";
import { tracksNutritionNumbers } from "../utils/nutritionMode";
import { clampReadinessScore, parseOptionalReadinessScore } from "../utils/readiness";
import { getPlannedTypeLabel } from "../utils/sportLabels";

function NutritionStat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-petrol-800/10 bg-white p-3">
      <p className="text-[0.82rem] font-black uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{value}</p>
      {hint ? <p className="mt-1 text-xs font-bold text-muted">{hint}</p> : null}
    </div>
  );
}

function parseMacro(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function QuickMealForm({
  date,
  showNumbers,
  showFiber,
  onSubmit,
  onDetailed,
  onCancel
}: {
  date: string;
  showNumbers: boolean;
  showFiber: boolean;
  onSubmit: (meal: Meal) => void;
  onDetailed: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    date,
    mealType: "lunch" as Meal["mealType"],
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    notes: ""
  });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    const mealType = form.mealType;
    onSubmit({
      id: makeId("meal"),
      date: form.date,
      mealType,
      name: MEAL_TYPE_LABELS[mealType],
      calories: showNumbers ? Math.round(parseMacro(form.calories)) : 0,
      protein: showNumbers ? Math.round(parseMacro(form.protein) * 10) / 10 : 0,
      carbs: showNumbers ? Math.round(parseMacro(form.carbs) * 10) / 10 : 0,
      fat: showNumbers ? Math.round(parseMacro(form.fat) * 10) / 10 : 0,
      fiber: showNumbers ? Math.round(parseMacro(form.fiber) * 10) / 10 : 0,
      notes: form.notes || undefined,
      source: "manual"
    });
  };

  return (
    <div className="grid gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft">
      <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
        {showNumbers
          ? "Saisie rapide : une estimation suivie bat un repas oublié. Calories + protéines suffisent pour commencer."
          : "Saisie rapide : type de repas, portions et sensations suffisent. Pas besoin de chiffres."}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="field-label">
          Date
          <input className="field" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label className="field-label">
          Type de repas
          <select className="field" value={form.mealType} onChange={(event) => update("mealType", event.target.value as Meal["mealType"])}>
            {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {showNumbers ? (
      <div className={`grid grid-cols-2 gap-3 ${showFiber ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}>
        <label className="field-label">
          Calories
          <input className="field" inputMode="decimal" value={form.calories} onChange={(event) => update("calories", event.target.value)} placeholder="650" />
        </label>
        <label className="field-label">
          Protéines
          <input className="field" inputMode="decimal" value={form.protein} onChange={(event) => update("protein", event.target.value)} placeholder="35" />
        </label>
        <label className="field-label">
          Glucides
          <input className="field" inputMode="decimal" value={form.carbs} onChange={(event) => update("carbs", event.target.value)} placeholder="optionnel" />
        </label>
        <label className="field-label">
          Lipides
          <input className="field" inputMode="decimal" value={form.fat} onChange={(event) => update("fat", event.target.value)} placeholder="optionnel" />
        </label>
        {showFiber ? (
          <label className="field-label">
            Fibres
            <input className="field" inputMode="decimal" value={form.fiber} onChange={(event) => update("fiber", event.target.value)} placeholder="optionnel" />
          </label>
        ) : null}
      </div>
      ) : (
        <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
          Mode sans calories : note le type de repas, les portions dans les notes, la source de protéines, l'eau et le timing autour séance.
        </div>
      )}
      <label className="field-label">
        Note facultative
        <input className="field" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ex : post-séance, resto, faim OK..." />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Annuler
        </button>
        {showNumbers ? (
        <button type="button" className="ghost-button" onClick={onDetailed}>
          Recherche / favoris
        </button>
        ) : null}
        <button type="button" className="action-button" onClick={save}>
          <Plus className="h-4 w-4" /> Enregistrer rapide
        </button>
      </div>
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

type NextNutritionAction = {
  tone: "preworkout" | "recovery" | "warning" | "protein" | "steady";
  eyebrow: string;
  title: string;
  message: string;
  chips: string[];
};

const nutritionActionToneClasses: Record<NextNutritionAction["tone"], string> = {
  preworkout: "border-limeSoft bg-limeSoft/70 text-petrol-900",
  recovery: "border-petrol-800 bg-petrol-800 text-white",
  warning: "border-red-300 bg-red-50 text-red-950",
  protein: "border-amber-200 bg-amber-50 text-amber-950",
  steady: "border-petrol-800/10 bg-mist/70 text-petrol-900"
};

function getNextNutritionAction({
  plannedSession,
  plannedSessionLabel,
  completedSessions,
  deficit,
  targetDeficit,
  protein,
  proteinTarget,
  remainingCalories,
  hungerLevel
}: {
  plannedSession?: PlannedSession;
  plannedSessionLabel?: string;
  completedSessions: CompletedSession[];
  deficit: number;
  targetDeficit: number;
  protein: number;
  proteinTarget: number;
  remainingCalories: number;
  hungerLevel?: number;
}): NextNutritionAction {
  const proteinGap = Math.max(0, Math.round(proteinTarget - protein));
  const deficitAboveTarget = Math.round(deficit - targetDeficit);
  const completedSession = completedSessions.find((session) => session.completed);
  const hasTrainingToday = plannedSession && plannedSession.type !== "rest";
  const remainingChip =
    remainingCalories >= 0
      ? `Reste ${Math.round(remainingCalories)} kcal`
      : `Au-dessus de la cible de ${Math.abs(Math.round(remainingCalories))} kcal`;
  const balanceChip =
    deficit >= 0 ? `Déficit ${Math.round(deficit)} kcal` : `Surplus ${Math.abs(Math.round(deficit))} kcal`;
  const chips = [
    remainingChip,
    `Protéines ${Math.round(protein)} / ${proteinTarget} g`,
    balanceChip
  ];

  if (completedSession) {
    return {
      tone: "recovery",
      eyebrow: "Après séance",
      title: "Repas de récupération",
      message:
        "Mets protéines + glucides dans les 2 h si possible. Simple et efficace : source protéinée, féculent, légumes, puis eau.",
      chips: [`${completedSession.title}`, ...chips]
    };
  }

  if (deficitAboveTarget > 350) {
    return {
      tone: "warning",
      eyebrow: "Énergie",
      title: "Déficit trop agressif",
      message:
        (hungerLevel ?? 0) >= 8
          ? "Déficit élevé + faim marquée : ajoute un repas simple protéiné/glucides et évite de transformer la perte de poids en fatigue."
          : "Ajoute 300 à 500 kcal simples aujourd'hui : féculent, fruit, laitage, huile d'olive/noix ou collation protéinée selon ta faim.",
      chips: [`+${deficitAboveTarget} kcal vs cible`, `Faim ${hungerLevel ?? 5}/10`, ...chips]
    };
  }

  if (hasTrainingToday) {
    return {
      tone: "preworkout",
      eyebrow: "Avant séance",
      title: "Collation légère si séance dans les 3 h",
      message:
        "Vise glucides + protéines digestes : banane + skyr, compote + whey, tartines + jambon, ou yaourt + céréales simples.",
      chips: [`${plannedSessionLabel ?? "Séance"} prévu`, `${plannedSession.durationMin} min`, ...chips]
    };
  }

  if (proteinGap >= 25) {
    return {
      tone: "protein",
      eyebrow: "Protéines",
      title: "Ajoute 25 à 35 g de protéines",
      message:
        "Options rapides : skyr, oeufs, thon, dinde, poulet, tofu, fromage blanc ou whey. Pas besoin de tout compenser d'un coup.",
      chips: [`${proteinGap} g restants`, ...chips]
    };
  }

  return {
    tone: "steady",
    eyebrow: "Maintenant",
    title: "Garde un repas simple",
    message:
      "Tu es dans une zone correcte. Continue avec une assiette lisible : protéines, légumes, féculent ajusté à la faim et à l'activité.",
    chips
  };
}

export default function MealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDate = searchParams.get("date");
  const { settings } = useSettings();
  const { meals, saveMeal, deleteMeal } = useMeals();
  const { favoriteMeals, saveFavoriteFromMeal, createMealFromFavorite, deleteFavoriteMeal } = useFavoriteMeals();
  const { sessions } = useSessions();
  const { weights } = useWeight();
  const showNutritionNumbers = tracksNutritionNumbers(settings);
  const showFiber = showNutritionNumbers && settings.nutritionMode === "advanced";
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [editing, setEditing] = useState<Meal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [detailedForm, setDetailedForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"journal" | "favorites">("journal");
  const [openMealId, setOpenMealId] = useState<string | null>(null);
  const [openFavoriteMealId, setOpenFavoriteMealId] = useState<string | null>(null);
  const { dailyContext, saveDailyContext } = useDailyContext(selectedDate);
  const formRef = useRef<HTMLDivElement>(null);
  const shouldOpenFromQuery = searchParams.get("add") === "1";
  const dayMeals = meals.filter((meal) => meal.date === selectedDate);
  const daySessions = sessions.filter((session) => session.date === selectedDate);
  const selectedWeek = getWeekIndexForDate(settings.startDate, settings.targetDate, selectedDate);
  const selectedPlannedSession = getPlannedWeek(settings, selectedWeek, settings.badmintonVariant).find(
    (session) => session.date === selectedDate
  );
  const totals = getMealTotals(dayMeals);
  const latestWeight = weights[weights.length - 1]?.weight ?? settings.defaultBodyWeight;
  const proteinTarget = showNutritionNumbers ? getProteinTarget(latestWeight, settings.proteinPerKg) : 0;
  const adaptiveCalorieTarget = getAdaptiveDailyCalorieTarget({
    settings,
    plannedSession: selectedPlannedSession,
    sessions: daySessions,
    energyLevel: dailyContext.energyLevel,
    steps: dailyContext.steps,
    floors: dailyContext.floors,
    bodyWeightKg: latestWeight
  });
  const dailyDeficit = showNutritionNumbers ? getDailyDeficit(dayMeals, adaptiveCalorieTarget.maintenanceTarget) : 0;
  const remainingCalories = showNutritionNumbers ? getRemainingCaloriesToTarget(dayMeals, adaptiveCalorieTarget.target) : 0;
  const nutritionAction = getNextNutritionAction({
    plannedSession: selectedPlannedSession,
    plannedSessionLabel: selectedPlannedSession ? getPlannedTypeLabel(selectedPlannedSession.type, settings) : undefined,
    completedSessions: daySessions,
    deficit: dailyDeficit,
    targetDeficit: adaptiveCalorieTarget.targetDeficit,
    protein: totals.protein,
    proteinTarget,
    remainingCalories,
    hungerLevel: dailyContext.hungerLevel
  });

  const saveExistingMealAsFavorite = (meal: Meal) => {
    const name = window.prompt("Nom du repas favori ?", meal.items?.[0]?.foodName ?? MEAL_TYPE_LABELS[meal.mealType]);
    if (!name?.trim()) return;
    saveFavoriteFromMeal(meal, name);
    setActiveTab("favorites");
  };

  const addFavoriteMealToSelectedDate = (favoriteId: string) => {
    const favorite = favoriteMeals.find((meal) => meal.id === favoriteId);
    if (!favorite) return;
    saveMeal(createMealFromFavorite(favorite, selectedDate));
    setActiveTab("journal");
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
    setDetailedForm(false);
    if (searchParams.has("add")) {
      const next = new URLSearchParams(searchParams);
      next.delete("add");
      setSearchParams(next, { replace: true });
    }
  };

  useEffect(() => {
    if (queryDate && /^\d{4}-\d{2}-\d{2}$/.test(queryDate)) {
      setSelectedDate(queryDate);
    }
  }, [queryDate]);

  useEffect(() => {
    if (shouldOpenFromQuery) {
      setActiveTab("journal");
      setShowForm(true);
      setDetailedForm(false);
    }
  }, [shouldOpenFromQuery]);

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
            <button
              className="mt-5 w-full action-button bg-limeSoft text-petrol-900 hover:bg-white"
              onClick={() => {
                setActiveTab("journal");
                setShowForm(true);
                setDetailedForm(false);
              }}
            >
              <Plus className="h-4 w-4" /> Ajouter repas
            </button>
          </div>

          <div className="grid gap-4 bg-white p-5 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[0.85fr_0.85fr_1.3fr]">
              <label className="field-label">
                Jour
                <input className="field" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </label>
              <div className="field-label">
                Réveil
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Fatigue /10</span>
                    <input
                      className="field"
                      type="number"
                      min="0"
                      max="10"
                      inputMode="numeric"
                      value={dailyContext.fatigueMorning ?? ""}
                      onChange={(event) =>
                        saveDailyContext({
                          ...dailyContext,
                          date: selectedDate,
                          fatigueMorning: parseOptionalReadinessScore(event.target.value)
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Douleur /10</span>
                    <input
                      className="field"
                      type="number"
                      min="0"
                      max="10"
                      inputMode="numeric"
                      value={dailyContext.painMorning ?? ""}
                      onChange={(event) =>
                        saveDailyContext({
                          ...dailyContext,
                          date: selectedDate,
                          painMorning: parseOptionalReadinessScore(event.target.value)
                        })
                      }
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Faim /10</span>
                    <input
                      className="field"
                      type="number"
                      min="0"
                      max="10"
                      inputMode="numeric"
                      value={dailyContext.hungerLevel ?? 5}
                      onChange={(event) =>
                        saveDailyContext({
                          ...dailyContext,
                          date: selectedDate,
                          hungerLevel: clampReadinessScore(Number(event.target.value))
                        })
                      }
                    />
                  </label>
                </div>
              </div>
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
                  <label className="grid gap-1">
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Eau ml</span>
                    <input
                      className="field"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={dailyContext.waterMl ? String(dailyContext.waterMl) : ""}
                      onChange={(event) =>
                        saveDailyContext({
                          ...dailyContext,
                          date: selectedDate,
                          waterMl: Number(event.target.value.replace(/\D/g, ""))
                        })
                      }
                      placeholder="Ex : 1500"
                    />
                    <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
                      Suivi simple, sans objectif médical précis.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className={`border-l-4 p-4 sm:p-5 ${showNutritionNumbers ? nutritionActionToneClasses[nutritionAction.tone] : "border-limeSoft bg-mist/60 text-ink"}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] opacity-70">
                    {showNutritionNumbers ? nutritionAction.eyebrow : "Journal simple"}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.06em]">
                    {showNutritionNumbers ? nutritionAction.title : "Repas sans calories"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm font-bold leading-6 opacity-80">
                    {showNutritionNumbers
                      ? nutritionAction.message
                      : "Note repas, portions, protéines, hydratation et timing autour séance. Aucun calcul de calories ou macros n'est affiché dans ce mode."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(showNutritionNumbers ? nutritionAction.chips : ["Sans calories", "Protéines", "Hydratation", "Timing séance"]).map((chip) => (
                      <span
                        key={chip}
                        className={`chip ${nutritionAction.tone === "recovery" ? "bg-white/15 text-white" : "bg-white/70"}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className={
                    nutritionAction.tone === "recovery"
                      ? "inline-flex items-center justify-center gap-2 bg-limeSoft px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-petrol-900"
                      : "action-button justify-center"
                  }
                  onClick={() => {
                    setActiveTab("journal");
                    setShowForm(true);
                    setDetailedForm(false);
                  }}
                >
                  <Plus className="h-4 w-4" /> Ajouter repas
                </button>
              </div>
            </div>

            {showNutritionNumbers ? (
            <>
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
                {showFiber ? <NutritionStat label="Fibres" value={`${Math.round(totals.fiber)} g`} hint="mode avancé" /> : null}
                <NutritionStat
                  label="Mouvement"
                  value={`${adaptiveCalorieTarget.neatCalories} kcal`}
                  hint={`${dailyContext.steps ?? 0} pas + ${dailyContext.floors ?? 0} étages`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.08em] text-petrol-800">
              <span className="chip">Glucides {Math.round(totals.carbs)} g</span>
              <span className="chip">Lipides {Math.round(totals.fat)} g</span>
              {showFiber ? <span className="chip">Fibres {Math.round(totals.fiber)} g</span> : null}
              <span className="chip">Dépense totale {adaptiveCalorieTarget.maintenanceTarget} kcal</span>
              <span className="chip">Cible à manger {adaptiveCalorieTarget.target} kcal</span>
            </div>

            <div className="grid gap-2 border border-petrol-800/10 bg-mist/45 p-3 text-sm font-bold sm:grid-cols-3">
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Métabolisme de base</p>
                <p className="mt-1 text-petrol-800">{adaptiveCalorieTarget.base} kcal</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Activité de base</p>
                <p className="mt-1 text-petrol-800">+{adaptiveCalorieTarget.baselineActivityCalories} kcal</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Sport validé</p>
                <p className="mt-1 text-petrol-800">{signedCalories(adaptiveCalorieTarget.activityFuel)}</p>
              </div>
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Mouvement quotidien</p>
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
                <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-muted">Total dépensé estimé</p>
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
            <details className="text-xs font-bold text-muted">
              <summary className="cursor-pointer text-[0.68rem] font-black uppercase tracking-[0.12em] text-petrol-800">
                Voir le calcul
              </summary>
              <p className="mt-2">
                Calcul simple : métabolisme de base {adaptiveCalorieTarget.base} + activité de base {adaptiveCalorieTarget.baselineActivityCalories} + sport validé{" "}
                {adaptiveCalorieTarget.activityFuel} + pas {adaptiveCalorieTarget.stepsNeatCalories} + étages {adaptiveCalorieTarget.floorsNeatCalories} + ressenti{" "}
                {adaptiveCalorieTarget.feelingFuel} = maintenance estimée {adaptiveCalorieTarget.maintenanceTarget} kcal. Cible à manger = maintenance - déficit{" "}
                {adaptiveCalorieTarget.targetDeficit}, plancher métabolisme de base {adaptiveCalorieTarget.minimumTarget} kcal : {adaptiveCalorieTarget.target} kcal.{" "}
                {balanceFormulaSentence(dailyDeficit, adaptiveCalorieTarget.maintenanceTarget, Math.round(totals.calories))}
              </p>
            </details>
            </>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={activeTab === "journal" ? "action-button justify-center" : "ghost-button justify-center"}
          onClick={() => setActiveTab("journal")}
        >
          <Utensils className="h-4 w-4" /> Journal du jour
        </button>
        <button
          type="button"
          className={activeTab === "favorites" ? "action-button justify-center" : "ghost-button justify-center"}
          onClick={() => setActiveTab("favorites")}
        >
          <Star className="h-4 w-4" /> Repas favoris ({favoriteMeals.length})
        </button>
      </div>

      {activeTab === "favorites" ? (
        <SectionCard className="p-5 sm:p-6">
          <p className="eyebrow">Repas favoris</p>
          <h2 className="title-lg mt-2">Repas réutilisables</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Enregistre un repas depuis le formulaire ou depuis un repas déjà saisi, puis ajoute-le à la date choisie.
          </p>

          <div className="mt-5 grid gap-3">
            {favoriteMeals.length ? (
              favoriteMeals.map((favorite) => {
                const isOpen = openFavoriteMealId === favorite.id;

                return (
                <article key={favorite.id} className="border border-petrol-800/10 bg-white p-4 shadow-soft">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => setOpenFavoriteMealId(isOpen ? null : favorite.id)}
                    >
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">
                        {MEAL_TYPE_LABELS[favorite.mealType]} - {favorite.calories} kcal
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{favorite.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="chip">{favorite.protein} g prot.</span>
                        <span className="chip">{favorite.carbs} g gluc.</span>
                        <span className="chip">{favorite.fat} g lip.</span>
                        <span className="chip">{favorite.items?.length ?? 0} aliments</span>
                        <span className="chip bg-white">{isOpen ? "Détails ouverts" : "Voir détails"}</span>
                      </div>
                    </button>
                    <div className="flex flex-wrap gap-2">
                      <button className="ghost-button" onClick={() => setOpenFavoriteMealId(isOpen ? null : favorite.id)} aria-label={isOpen ? "Replier le favori" : "Développer le favori"}>
                        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <button className="action-button" onClick={() => addFavoriteMealToSelectedDate(favorite.id)}>
                        <Plus className="h-4 w-4" /> Ajouter au {formatLongDate(selectedDate)}
                      </button>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          if (window.confirm("Supprimer ce repas favori ?")) deleteFavoriteMeal(favorite.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                  {isOpen && favorite.items?.length ? (
                    <div className="mt-4 grid gap-2 border-t border-petrol-800/10 pt-4">
                      {favorite.items.map((item) => (
                        <div key={item.id} className="border-l-4 border-limeSoft bg-mist/45 px-3 py-2">
                          <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">
                            {item.quantityGrams} g
                          </p>
                          <p className="text-sm font-black text-petrol-800">{item.foodName}</p>
                          <p className="text-xs font-bold text-muted">
                            {item.calories} kcal - P {item.protein} g | G {item.carbs} g | L {item.fat} g
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
                );
              })
            ) : (
              <EmptyState
                icon={Star}
                title="Aucun repas favori"
                message="Crée un repas dans le formulaire, donne-lui un nom, puis sauvegarde-le en favori."
              />
            )}
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "journal" && (showForm || editing) ? (
        <div ref={formRef}>
          <SectionCard className="p-5 sm:p-6">
            <p className="eyebrow">{editing ? "Modifier" : "Ajout rapide"}</p>
            <h2 className="title-lg mt-2">{editing ? MEAL_TYPE_LABELS[editing.mealType] : "Nouveau repas"}</h2>
            <div className="mt-5">
              {editing || detailedForm ? (
                <MealForm
                  initial={editing ?? { date: selectedDate }}
                  onCancel={closeForm}
                  onSubmit={(meal) => {
                    saveMeal(meal);
                    setSelectedDate(meal.date);
                    closeForm();
                  }}
                />
              ) : (
                <QuickMealForm
                  date={selectedDate}
                  showNumbers={showNutritionNumbers}
                  showFiber={showFiber}
                  onCancel={closeForm}
                  onDetailed={() => setDetailedForm(true)}
                  onSubmit={(meal) => {
                    saveMeal(meal);
                    setSelectedDate(meal.date);
                    closeForm();
                  }}
                />
              )}
            </div>
          </SectionCard>
        </div>
      ) : null}

      {activeTab === "journal" ? (
      <SectionCard className="p-5 sm:p-6">
        <p className="eyebrow">{formatLongDate(selectedDate)}</p>
        <h2 className="title-lg mt-2">Repas du jour</h2>

        <div className="mt-5 grid gap-3">
          {dayMeals.length ? (
            dayMeals.map((meal) => {
              const isOpen = openMealId === meal.id;

              return (
              <article key={meal.id} className="border border-petrol-800/10 bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpenMealId(isOpen ? null : meal.id)}>
                    <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{MEAL_TYPE_LABELS[meal.mealType]}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">{meal.calories} kcal</span>
                      <span className="chip">{meal.protein} g prot.</span>
                      <span className="chip">{meal.carbs} g gluc.</span>
                      <span className="chip">{meal.fat} g lip.</span>
                      {showFiber && (meal.fiber ?? 0) > 0 ? <span className="chip">{meal.fiber} g fibres</span> : null}
                      {meal.items?.length ? <span className="chip">{meal.items.length} aliment(s)</span> : null}
                      <span className="chip bg-white">{isOpen ? "Détails ouverts" : "Voir détails"}</span>
                    </div>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button className="ghost-button" onClick={() => setOpenMealId(isOpen ? null : meal.id)} aria-label={isOpen ? "Replier le repas" : "Développer le repas"}>
                      <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <button className="ghost-button" onClick={() => saveExistingMealAsFavorite(meal)} aria-label="Enregistrer en repas favori">
                      <Star className="h-4 w-4" />
                    </button>
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

                {isOpen ? (
                  <div className="mt-4 border-t border-petrol-800/10 pt-4">
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
                              {showFiber && (item.fiber ?? 0) > 0 ? ` | Fibres ${item.fiber} g` : ""}
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
                      {meal.quantityGrams ? <span className="chip">{meal.quantityGrams} g</span> : null}
                      {meal.source === "openfoodfacts" ? <span className="chip bg-limeSoft">Open Food Facts</span> : null}
                      {meal.source === "common" ? <span className="chip bg-limeSoft">Aliment simple</span> : null}
                    </div>
                    {meal.notes ? <p className="mt-4 border-l-4 border-limeSoft bg-mist/50 p-4 text-sm font-semibold text-ink">{meal.notes}</p> : null}
                  </div>
                ) : null}
              </article>
              );
            })
          ) : (
            <EmptyState icon={Utensils} title="Aucun repas ce jour" message="Ajoute un repas en un tap, même approximatif. L'approximation suivie bat le parfait oublié." />
          )}
        </div>
      </SectionCard>
      ) : null}
    </>
  );
}
