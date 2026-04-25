import { useEffect, useState, type FormEvent } from "react";
import { Plus, Save, Search, Trash2, X } from "lucide-react";
import { MEAL_TYPE_LABELS } from "../../data/defaults";
import { FAVORITE_FOOD_GROUPS } from "../../data/commonFoods";
import {
  calculateFoodMacros,
  searchOpenFoodFacts,
  type FoodProduct
} from "../../services/openFoodFactsService";
import {
  deleteFavoriteFood,
  loadFavoriteFoods,
  saveFavoriteFood,
  subscribeFavoriteFoods,
  type FavoriteFood
} from "../../services/favoriteFoodsService";
import { makeId } from "../../services/storageService";
import type { Meal, MealFoodItem, MealQuantityUnit } from "../../types";
import { toISODate } from "../../utils/dates";

type MealFormProps = {
  initial?: Partial<Meal>;
  onSubmit: (meal: Meal) => void;
  onCancel?: () => void;
};

type MealFormState = {
  id: string;
  date: string;
  mealType: Meal["mealType"];
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
};

type MealDraft = {
  form: MealFormState;
  mealItems: MealFoodItem[];
  searchTerm: string;
  quantityInput: string;
  quantityUnit: MealQuantityUnit;
  selectedProduct: FoodProduct | null;
};

const MEAL_DRAFT_KEY = "hyrox-prep-tracker:meal-draft:v1";

function parseDecimal(value: string): number {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDecimal(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10).replace(".", ",");
}

function parseQuantityValue(value?: string): number | undefined {
  const normalized = value?.toLowerCase().replace(",", ".");
  if (!normalized) return undefined;

  const unitMatches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(kg|g|mg|ml|cl|l|litre|litres)\b/g)];
  const unitMatch = unitMatches.length ? unitMatches[unitMatches.length - 1] : undefined;
  const fallbackMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  const match = unitMatch ?? fallbackMatch;
  if (!match) return undefined;

  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;

  const unit = unitMatch?.[2];
  if (unit === "kg" || unit === "l" || unit === "litre" || unit === "litres") return parsed * 1000;
  if (unit === "cl") return parsed * 10;
  if (unit === "mg") return parsed / 1000;

  return parsed;
}

function isDoseProduct(product: FoodProduct): boolean {
  const text = [product.name, product.brand, product.code].filter(Boolean).join(" ").toLowerCase();
  return /whey|isolate|iso zero|collag[èe]ne|cas[ée]ine|caseine|protein powder|protéine en poudre|proteine en poudre|nutripure|nutrimuscle|myprotein|bulk|foodspring|aptonia|eafit|prozis/.test(
    text
  );
}

function isVolumeProduct(product: FoodProduct): boolean {
  const text = [product.name, product.brand, product.quantity, product.servingSize].filter(Boolean).join(" ").toLowerCase();
  return /\b(boisson|lait|jus|eau|ml|cl|litre|shake)\b/.test(text);
}

function getServingQuantity(product: FoodProduct): number {
  if (product.servingQuantity && product.servingQuantity > 0) return product.servingQuantity;

  const servingSize = parseQuantityValue(product.servingSize);
  if (servingSize) return servingSize;

  const packageQuantity = parseQuantityValue(product.quantity);
  return packageQuantity && packageQuantity <= 500 ? packageQuantity : 30;
}

function getDefaultQuantityUnit(product: FoodProduct): MealQuantityUnit {
  if (isDoseProduct(product)) return "dose";
  if (isVolumeProduct(product)) return "ml";
  return "g";
}

function getDefaultQuantityInput(product: FoodProduct, unit: MealQuantityUnit): string {
  if (unit === "dose") return "1";

  const servingQuantity = product.servingQuantity && product.servingQuantity > 0 ? product.servingQuantity : undefined;
  const servingSize = parseQuantityValue(product.servingSize);
  const packageQuantity = parseQuantityValue(product.quantity);

  if (servingQuantity) return formatDecimal(servingQuantity);
  if (servingSize) return formatDecimal(servingSize);
  if (unit === "ml" && packageQuantity && packageQuantity <= 750) return formatDecimal(packageQuantity);
  if (unit === "g" && packageQuantity && packageQuantity <= 150) return formatDecimal(packageQuantity);

  return "100";
}

function getEffectiveQuantity(product: FoodProduct, quantityInput: string, quantityUnit: MealQuantityUnit): number {
  const parsed = parseDecimal(quantityInput);
  if (quantityUnit === "dose") return parsed * getServingQuantity(product);
  return parsed;
}

function getQuantityLabel(quantityInput: number, quantityUnit: MealQuantityUnit, quantityGrams: number): string {
  if (quantityUnit === "dose") return `${formatDecimal(quantityInput)} dose (${formatDecimal(quantityGrams)} g)`;
  return `${formatDecimal(quantityInput)} ${quantityUnit}`;
}

function unitHint(product: FoodProduct, quantityUnit: MealQuantityUnit, effectiveQuantity: number): string {
  if (quantityUnit === "dose") return `1 dose = ${formatDecimal(getServingQuantity(product))} g`;
  if (quantityUnit === "ml") return `${formatDecimal(effectiveQuantity)} ml utilisés comme équivalent nutritionnel`;
  return `${formatDecimal(effectiveQuantity)} g`;
}

function getItemTotals(items: MealFoodItem[]) {
  return items.reduce(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function productFromMeal(meal?: Partial<Meal>): FoodProduct | null {
  if (!meal?.foodCode || !meal.foodName) return null;

  return {
    code: meal.foodCode,
    name: meal.foodName,
    brand: meal.brand,
    calories100g: meal.foodCalories100g ?? 0,
    protein100g: meal.foodProtein100g ?? 0,
    carbs100g: meal.foodCarbs100g ?? 0,
    fat100g: meal.foodFat100g ?? 0,
    servingQuantity: meal.servingQuantityGrams,
    origin: meal.source === "common" ? "common" : "openfoodfacts"
  };
}

function itemsFromMeal(meal?: Partial<Meal>): MealFoodItem[] {
  if (meal?.items?.length) return meal.items;
  if (!meal?.foodName || !meal.quantityGrams) return [];

  return [
    {
      id: makeId("food"),
      source: meal.source === "common" || meal.source === "openfoodfacts" ? meal.source : "manual",
      foodCode: meal.foodCode,
      foodName: meal.foodName,
      brand: meal.brand,
      quantityInput: meal.quantityInput ?? meal.quantityGrams,
      quantityUnit: meal.quantityUnit ?? "g",
      quantityGrams: meal.quantityGrams,
      servingQuantityGrams: meal.servingQuantityGrams,
      calories: meal.calories ?? 0,
      protein: meal.protein ?? 0,
      carbs: meal.carbs ?? 0,
      fat: meal.fat ?? 0,
      foodCalories100g: meal.foodCalories100g,
      foodProtein100g: meal.foodProtein100g,
      foodCarbs100g: meal.foodCarbs100g,
      foodFat100g: meal.foodFat100g
    }
  ];
}

function productLabel(product: FoodProduct): string {
  const brand = product.brand ? ` - ${product.brand}` : "";
  const quantity = product.quantity ? ` (${product.quantity})` : "";
  const source = product.origin === "common" ? " - Simple" : "";
  return `${product.name}${brand}${quantity}${source} - ${product.calories100g} kcal / 100 g`;
}

function readMealDraft(): MealDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(MEAL_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as MealDraft) : null;
  } catch {
    return null;
  }
}

export function MealForm({ initial, onSubmit, onCancel }: MealFormProps) {
  const initialProduct = productFromMeal(initial);
  const isEditing = Boolean(initial?.id);
  const defaultForm: MealFormState = {
    id: initial?.id ?? makeId("meal"),
    date: initial?.date ?? toISODate(new Date()),
    mealType: initial?.mealType ?? "lunch",
    name: initial?.name ?? "",
    calories: String(initial?.calories ?? ""),
    protein: String(initial?.protein ?? ""),
    carbs: String(initial?.carbs ?? ""),
    fat: String(initial?.fat ?? ""),
    notes: initial?.notes ?? ""
  };
  const savedDraft = !isEditing ? readMealDraft() : null;
  const [form, setForm] = useState<MealFormState>(savedDraft?.form ?? defaultForm);
  const [mealItems, setMealItems] = useState<MealFoodItem[]>(() => savedDraft?.mealItems ?? itemsFromMeal(initial));
  const [searchTerm, setSearchTerm] = useState(savedDraft?.searchTerm ?? "");
  const [results, setResults] = useState<FoodProduct[]>(initialProduct ? [initialProduct] : []);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(savedDraft?.selectedProduct ?? initialProduct);
  const [quantityInput, setQuantityInput] = useState(
    savedDraft?.quantityInput ?? (initial?.quantityGrams ? formatDecimal(initial.quantityGrams) : "100")
  );
  const [quantityUnit, setQuantityUnit] = useState<MealQuantityUnit>(savedDraft?.quantityUnit ?? initial?.quantityUnit ?? "g");
  const [favoriteGroup, setFavoriteGroup] = useState<string>(FAVORITE_FOOD_GROUPS[0].id);
  const [selectedFavoriteCode, setSelectedFavoriteCode] = useState("");
  const [favoriteFoods, setFavoriteFoods] = useState<FavoriteFood[]>(() => loadFavoriteFoods());
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const itemTotals = getItemTotals(mealItems);
  const hasItems = mealItems.length > 0;
  const effectiveQuantity = selectedProduct ? getEffectiveQuantity(selectedProduct, quantityInput, quantityUnit) : 0;
  const previewMacros = selectedProduct ? calculateFoodMacros(selectedProduct, effectiveQuantity) : null;
  const selectedFavoriteGroup =
    FAVORITE_FOOD_GROUPS.find((group) => group.id === favoriteGroup) ?? FAVORITE_FOOD_GROUPS[0];
  const selectedFavoriteFoods = favoriteFoods.filter((food) => food.favoriteCategory === favoriteGroup);
  const selectedFavoriteProduct = selectedFavoriteFoods.find((food) => food.code === selectedFavoriteCode);

  useEffect(() => {
    return subscribeFavoriteFoods(() => {
      setFavoriteFoods(loadFavoriteFoods());
    });
  }, []);

  useEffect(() => {
    if (isEditing || typeof window === "undefined") return;

    const draft: MealDraft = {
      form,
      mealItems,
      searchTerm,
      quantityInput,
      quantityUnit,
      selectedProduct
    };

    window.localStorage.setItem(MEAL_DRAFT_KEY, JSON.stringify(draft));
  }, [form, isEditing, mealItems, quantityInput, quantityUnit, searchTerm, selectedProduct]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const clearDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(MEAL_DRAFT_KEY);
    }
    setForm(defaultForm);
    setMealItems(itemsFromMeal(initial));
    setSearchTerm("");
    setSelectedProduct(initialProduct);
    setQuantityInput(initial?.quantityGrams ? formatDecimal(initial.quantityGrams) : "100");
    setQuantityUnit(initial?.quantityUnit ?? "g");
    setSearchError("");
  };

  const selectProduct = (product: FoodProduct) => {
    const defaultUnit = getDefaultQuantityUnit(product);
    setSelectedProduct(product);
    setQuantityUnit(defaultUnit);
    setQuantityInput(getDefaultQuantityInput(product, defaultUnit));
  };

  const updateSelectedQuantityUnit = (nextUnit: MealQuantityUnit) => {
    if (selectedProduct) {
      if (nextUnit === "dose" && quantityUnit !== "dose") {
        setQuantityInput("1");
      } else if (quantityUnit === "dose" && nextUnit !== "dose") {
        setQuantityInput(formatDecimal(getServingQuantity(selectedProduct)));
      }
    }

    setQuantityUnit(nextUnit);
  };

  const addSelectedProduct = () => {
    if (!selectedProduct) return;
    const quantityInputValue = parseDecimal(quantityInput);
    const quantityGrams = getEffectiveQuantity(selectedProduct, quantityInput, quantityUnit);
    if (quantityGrams <= 0) {
      setSearchError("Saisis une quantité valide, par exemple 100 ou 27,5.");
      return;
    }

    const macros = calculateFoodMacros(selectedProduct, quantityGrams);
    setMealItems((current) => [
      ...current,
      {
        id: makeId("food"),
        source: selectedProduct.origin,
        foodCode: selectedProduct.code,
        foodName: selectedProduct.name,
        brand: selectedProduct.brand,
        quantityInput: quantityInputValue,
        quantityUnit,
        quantityGrams,
        servingQuantityGrams: quantityUnit === "dose" ? getServingQuantity(selectedProduct) : undefined,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        foodCalories100g: selectedProduct.calories100g,
        foodProtein100g: selectedProduct.protein100g,
        foodCarbs100g: selectedProduct.carbs100g,
        foodFat100g: selectedProduct.fat100g
      }
    ]);
    setSearchError("");
  };

  const addFavoriteProductToMeal = () => {
    if (!selectedFavoriteProduct) return;
    const quantityInputValue = parseDecimal(quantityInput);
    const quantityGrams = getEffectiveQuantity(selectedFavoriteProduct, quantityInput, quantityUnit);
    if (quantityGrams <= 0) {
      setSearchError("Saisis une quantité valide, par exemple 100 ou 27,5.");
      return;
    }

    const macros = calculateFoodMacros(selectedFavoriteProduct, quantityGrams);
    setMealItems((current) => [
      ...current,
      {
        id: makeId("food"),
        source: selectedFavoriteProduct.origin,
        foodCode: selectedFavoriteProduct.code,
        foodName: selectedFavoriteProduct.name,
        brand: selectedFavoriteProduct.brand,
        quantityInput: quantityInputValue,
        quantityUnit,
        quantityGrams,
        servingQuantityGrams: quantityUnit === "dose" ? getServingQuantity(selectedFavoriteProduct) : undefined,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        foodCalories100g: selectedFavoriteProduct.calories100g,
        foodProtein100g: selectedFavoriteProduct.protein100g,
        foodCarbs100g: selectedFavoriteProduct.carbs100g,
        foodFat100g: selectedFavoriteProduct.fat100g
      }
    ]);
    setSearchError("");
  };

  const addSelectedProductToFavorites = () => {
    if (!selectedProduct) return;
    const next = saveFavoriteFood(selectedProduct, favoriteGroup);
    setFavoriteFoods(next);
    setSelectedFavoriteCode(selectedProduct.code);
    setFavoriteMessage(`${selectedProduct.name} ajouté aux favoris.`);
  };

  const selectFavoriteProduct = (code: string) => {
    setSelectedFavoriteCode(code);
    const favorite = selectedFavoriteFoods.find((food) => food.code === code);
    if (favorite) selectProduct(favorite);
  };

  const removeSelectedFavorite = () => {
    if (!selectedFavoriteCode) return;
    const next = deleteFavoriteFood(selectedFavoriteCode, favoriteGroup);
    setFavoriteFoods(next);
    setSelectedFavoriteCode("");
    setFavoriteMessage("Favori retiré.");
  };

  const removeItem = (id: string) => {
    setMealItems((current) => current.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: string, value: string, nextUnit?: MealQuantityUnit) => {
    setMealItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const unit = nextUnit ?? item.quantityUnit ?? "g";
        const quantityInputValue = parseDecimal(value);
        const servingQuantityGrams = item.servingQuantityGrams ?? (unit === "dose" ? 30 : undefined);
        const quantityGrams =
          unit === "dose" ? quantityInputValue * (servingQuantityGrams ?? 30) : quantityInputValue;

        if (quantityGrams <= 0) {
          return { ...item, quantityInput: quantityInputValue, quantityUnit: unit, quantityGrams: 0, calories: 0, protein: 0, carbs: 0, fat: 0 };
        }

        const baseProduct: FoodProduct = {
          code: item.foodCode ?? item.id,
          name: item.foodName,
          brand: item.brand,
          calories100g:
            item.foodCalories100g ?? (item.quantityGrams > 0 ? (item.calories / item.quantityGrams) * 100 : 0),
          protein100g:
            item.foodProtein100g ?? (item.quantityGrams > 0 ? (item.protein / item.quantityGrams) * 100 : 0),
          carbs100g:
            item.foodCarbs100g ?? (item.quantityGrams > 0 ? (item.carbs / item.quantityGrams) * 100 : 0),
          fat100g:
            item.foodFat100g ?? (item.quantityGrams > 0 ? (item.fat / item.quantityGrams) * 100 : 0),
          origin: item.source === "openfoodfacts" ? "openfoodfacts" : "common"
        };
        const macros = calculateFoodMacros(baseProduct, quantityGrams);

        return {
          ...item,
          quantityInput: quantityInputValue,
          quantityUnit: unit,
          quantityGrams,
          servingQuantityGrams,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          foodCalories100g: baseProduct.calories100g,
          foodProtein100g: baseProduct.protein100g,
          foodCarbs100g: baseProduct.carbs100g,
          foodFat100g: baseProduct.fat100g
        };
      })
    );
  };

  const runSearch = async () => {
    setSearchError("");
    setIsSearching(true);

    try {
      const products = await searchOpenFoodFacts(searchTerm);
      setResults(products);
      setSelectedProduct(null);
      if (!products.length) {
        setSearchError("Aucun aliment trouvé avec des valeurs nutritionnelles exploitables.");
      }
    } catch {
      setSearchError("Recherche indisponible. Les aliments simples locaux restent disponibles si le mot est connu.");
    } finally {
      setIsSearching(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const totals = hasItems
      ? itemTotals
      : {
          calories: parseDecimal(form.calories),
          protein: parseDecimal(form.protein),
          carbs: parseDecimal(form.carbs),
          fat: parseDecimal(form.fat)
        };
    const firstItem = mealItems.length === 1 ? mealItems[0] : undefined;

    if (!isEditing && typeof window !== "undefined") {
      window.localStorage.removeItem(MEAL_DRAFT_KEY);
    }

    onSubmit({
      id: form.id,
      date: form.date,
      mealType: form.mealType,
      name: form.name || MEAL_TYPE_LABELS[form.mealType],
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      notes: form.notes || undefined,
      source: firstItem?.source,
      foodCode: firstItem?.foodCode,
      foodName: firstItem?.foodName,
      brand: firstItem?.brand,
      quantityInput: firstItem?.quantityInput,
      quantityUnit: firstItem?.quantityUnit,
      quantityGrams: firstItem?.quantityGrams,
      servingQuantityGrams: firstItem?.servingQuantityGrams,
      foodCalories100g: firstItem?.foodCalories100g,
      foodProtein100g: firstItem?.foodProtein100g,
      foodCarbs100g: firstItem?.foodCarbs100g,
      foodFat100g: firstItem?.foodFat100g,
      items: mealItems.length ? mealItems : undefined
    });
  };

  return (
    <form onSubmit={submit} className="grid w-full max-w-full gap-4 overflow-hidden border border-petrol-800/10 bg-white p-3 shadow-soft sm:p-4">
      <div className="min-w-0 overflow-hidden border border-petrol-800/10 bg-mist/45 p-3 sm:p-4">
        
          <div className="mb-4 min-w-0 overflow-hidden border border-petrol-800/10 bg-white p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <label className="field-label sm:w-64">
                Catégorie de favoris
                <select
                  className="field"
                  value={favoriteGroup}
                  onChange={(event) => {
                    setFavoriteGroup(event.target.value);
                    setSelectedFavoriteCode("");
                  }}
                >
                  {FAVORITE_FOOD_GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs font-bold text-muted">
                Le brouillon est sauvegardé automatiquement. Tu peux fermer et reprendre sans perdre le repas.
              </p>
            </div>

            <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_8rem_7rem_auto_auto] lg:items-end">
              <label className="field-label">
                Aliment favori
                <select
                  className="field"
                  value={selectedFavoriteCode}
                  disabled={!selectedFavoriteFoods.length}
                  onChange={(event) => selectFavoriteProduct(event.target.value)}
                >
                  <option value="">
                    {selectedFavoriteFoods.length ? "Choisir un favori..." : `Aucun favori dans ${selectedFavoriteGroup.label}`}
                  </option>
                  {selectedFavoriteFoods.map((food) => (
                    <option key={`${food.code}-${food.favoriteCategory}`} value={food.code}>
                      {productLabel(food)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Quantité
                <input
                  className="field"
                  inputMode="decimal"
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                  placeholder="100"
                />
              </label>
              <label className="field-label">
                Unité
                <select
                  className="field"
                  value={quantityUnit}
                  onChange={(event) => updateSelectedQuantityUnit(event.target.value as MealQuantityUnit)}
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="dose">dose</option>
                </select>
              </label>
              <button type="button" className="action-button w-full lg:w-auto" disabled={!selectedFavoriteProduct} onClick={addFavoriteProductToMeal}>
                <Plus className="h-4 w-4" /> Ajouter au repas
              </button>
              <button type="button" className="ghost-button w-full lg:w-auto" disabled={!selectedFavoriteCode} onClick={removeSelectedFavorite}>
                <Trash2 className="h-4 w-4" /> Retirer
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-muted">
              Ce menu affiche uniquement tes favoris ajoutés. Les aliments simples restent accessibles via la recherche.
            </p>
          </div>
        

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
          <label className="field-label flex-1">
            Rechercher un aliment
            <input
              className="field"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ex : skyr, banane, compote..."
            />
          </label>
          <button type="button" className="action-button w-full sm:w-auto" disabled={isSearching || searchTerm.trim().length < 2} onClick={runSearch}>
            <Search className="h-4 w-4" /> {isSearching ? "Recherche..." : "Chercher"}
          </button>
        </div>

        {searchError ? <p className="mt-3 text-sm font-bold text-petrol-800">{searchError}</p> : null}

        {results.length ? (
          <label className="field-label mt-4">
            Résultats
            <select
              className="field"
              value={selectedProduct?.code ?? ""}
              onChange={(event) => {
                const product = results.find((item) => item.code === event.target.value);
                if (product) selectProduct(product);
              }}
            >
              <option value="">Choisir un aliment...</option>
              {results.map((product) => (
                <option key={product.code} value={product.code}>
                  {productLabel(product)}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {selectedProduct ? (
          <div className="mt-4 grid min-w-0 gap-3 overflow-hidden border-l-4 border-limeSoft bg-white p-3 sm:grid-cols-[minmax(0,1fr)_8rem_7rem_auto_auto] sm:items-end sm:p-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Aliment sélectionné</p>
              <p className="mt-1 break-words font-display text-xl font-black tracking-[-0.05em] text-petrol-800 sm:text-2xl">
                {selectedProduct.name}
              </p>
              <p className="mt-1 text-sm font-bold text-muted">
                {[selectedProduct.brand, selectedProduct.quantity].filter(Boolean).join(" - ") ||
                  (selectedProduct.origin === "common" ? "Aliment simple" : "Open Food Facts")}
              </p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-petrol-700">
                {previewMacros?.calories ?? 0} kcal | P {formatDecimal(previewMacros?.protein ?? 0)} g | G{" "}
                {formatDecimal(previewMacros?.carbs ?? 0)} g | L {formatDecimal(previewMacros?.fat ?? 0)} g
              </p>
              <p className="mt-1 text-xs font-bold text-muted">{unitHint(selectedProduct, quantityUnit, effectiveQuantity)}</p>
            </div>
            <label className="field-label">
              Quantité
              <input
                className="field"
                inputMode="decimal"
                value={quantityInput}
                onChange={(event) => setQuantityInput(event.target.value)}
                placeholder="100 ou 27,5"
              />
            </label>
            <label className="field-label">
              Unité
              <select
                className="field"
                value={quantityUnit}
                onChange={(event) => updateSelectedQuantityUnit(event.target.value as MealQuantityUnit)}
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="dose">dose</option>
              </select>
            </label>
            <button type="button" className="action-button w-full sm:w-auto" onClick={addSelectedProduct}>
              <Plus className="h-4 w-4" /> Ajouter
            </button>
            <button type="button" className="ghost-button w-full sm:w-auto" onClick={addSelectedProductToFavorites}>
              Ajouter aux favoris
            </button>
          </div>
        ) : null}

        {favoriteMessage ? <p className="mt-3 text-sm font-black text-petrol-800">{favoriteMessage}</p> : null}

        {mealItems.length ? (
          <div className="mt-4 grid gap-2">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Aliments du repas</p>
            {mealItems.map((item) => (
              <div key={item.id} className="grid min-w-0 gap-3 overflow-hidden border border-petrol-800/10 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_8rem_7rem_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="break-words font-black text-petrol-800">{item.foodName}</p>
                  <p className="text-xs font-bold text-muted">
                    {getQuantityLabel(item.quantityInput ?? item.quantityGrams, item.quantityUnit ?? "g", item.quantityGrams)} -{" "}
                    {item.calories} kcal - P {formatDecimal(item.protein)} g | G{" "}
                    {formatDecimal(item.carbs)} g | L {formatDecimal(item.fat)} g
                  </p>
                </div>
                <label className="field-label">
                  Quantité
                  <input
                    className="field"
                    inputMode="decimal"
                    value={formatDecimal(item.quantityInput ?? item.quantityGrams)}
                    onChange={(event) => updateItemQuantity(item.id, event.target.value)}
                  />
                </label>
                <label className="field-label">
                  Unité
                  <select
                    className="field"
                    value={item.quantityUnit ?? "g"}
                    onChange={(event) => {
                      const currentUnit = item.quantityUnit ?? "g";
                      const nextUnit = event.target.value as MealQuantityUnit;
                      const nextValue =
                        nextUnit === "dose" && currentUnit !== "dose"
                          ? "1"
                          : currentUnit === "dose" && nextUnit !== "dose"
                            ? formatDecimal(item.quantityGrams)
                            : formatDecimal(item.quantityInput ?? item.quantityGrams);
                      updateItemQuantity(item.id, nextValue, nextUnit);
                    }}
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="dose">dose</option>
                  </select>
                </label>
                <button type="button" className="ghost-button w-full sm:w-auto" onClick={() => removeItem(item.id)} aria-label="Retirer l'aliment">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
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

      <label className="field-label">
        Nom du repas
        <input
          className="field"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Ex : Déjeuner, Bowl post-training, Dîner léger..."
        />
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="field-label">
          Calories
          <input
            className="field"
            inputMode="decimal"
            readOnly={hasItems}
            value={hasItems ? String(Math.round(itemTotals.calories)) : form.calories}
            onChange={(event) => update("calories", event.target.value)}
          />
        </label>
        <label className="field-label">
          Protéines
          <input
            className="field"
            inputMode="decimal"
            readOnly={hasItems}
            value={hasItems ? formatDecimal(itemTotals.protein) : form.protein}
            onChange={(event) => update("protein", event.target.value)}
          />
        </label>
        <label className="field-label">
          Glucides
          <input
            className="field"
            inputMode="decimal"
            readOnly={hasItems}
            value={hasItems ? formatDecimal(itemTotals.carbs) : form.carbs}
            onChange={(event) => update("carbs", event.target.value)}
          />
        </label>
        <label className="field-label">
          Lipides
          <input
            className="field"
            inputMode="decimal"
            readOnly={hasItems}
            value={hasItems ? formatDecimal(itemTotals.fat) : form.fat}
            onChange={(event) => update("fat", event.target.value)}
          />
        </label>
      </div>

      <label className="field-label">
        Notes
        <textarea className="textarea-field" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Faim, timing autour de l'entraînement, digestion..." />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {!isEditing ? (
          <button type="button" className="ghost-button w-full sm:w-auto" onClick={clearDraft}>
            <Trash2 className="h-4 w-4" /> Effacer brouillon
          </button>
        ) : null}
        {onCancel ? (
          <button type="button" className="ghost-button w-full sm:w-auto" onClick={onCancel}>
            <X className="h-4 w-4" /> Annuler
          </button>
        ) : null}
        <button type="submit" className="action-button w-full sm:w-auto">
          <Save className="h-4 w-4" /> Enregistrer
        </button>
      </div>
    </form>
  );
}
