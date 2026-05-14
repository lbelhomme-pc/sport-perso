import { Trash2 } from "lucide-react";
import type { MealFoodItem, MealQuantityUnit } from "../../types";

type MealItemsEditorProps = {
  items: MealFoodItem[];
  formatDecimal: (value: number) => string;
  getQuantityLabel: (quantityInput: number, quantityUnit: MealQuantityUnit, quantityGrams: number) => string;
  onQuantityChange: (id: string, value: string, unit?: MealQuantityUnit) => void;
  onRemove: (id: string) => void;
};

export function MealItemsEditor({
  items,
  formatDecimal,
  getQuantityLabel,
  onQuantityChange,
  onRemove
}: MealItemsEditorProps) {
  if (!items.length) return null;

  return (
    <div className="mt-4 grid gap-2">
      <p className="text-sm font-black uppercase tracking-[0.06em] text-muted">Aliments du repas</p>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid min-w-0 gap-3 overflow-hidden border border-petrol-800/10 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_8rem_7rem_auto] sm:items-center"
        >
          <div className="min-w-0">
            <p className="break-words font-black text-petrol-800">{item.foodName}</p>
            <p className="text-sm font-bold text-muted">
              {getQuantityLabel(item.quantityInput ?? item.quantityGrams, item.quantityUnit ?? "g", item.quantityGrams)} - {item.calories} kcal - P{" "}
              {formatDecimal(item.protein)} g | G {formatDecimal(item.carbs)} g | L {formatDecimal(item.fat)} g
              {(item.fiber ?? 0) > 0 ? ` | Fibres ${formatDecimal(item.fiber ?? 0)} g` : ""}
            </p>
          </div>
          <label className="field-label">
            Quantité
            <input
              className="field"
              inputMode="decimal"
              value={formatDecimal(item.quantityInput ?? item.quantityGrams)}
              onChange={(event) => onQuantityChange(item.id, event.target.value)}
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
                onQuantityChange(item.id, nextValue, nextUnit);
              }}
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="dose">dose</option>
            </select>
          </label>
          <button type="button" className="ghost-button w-full sm:w-auto" onClick={() => onRemove(item.id)} aria-label="Retirer l'aliment">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
