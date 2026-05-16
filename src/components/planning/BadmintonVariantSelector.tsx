import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BADMINTON_VARIANTS } from "../../data/defaults";
import type { BadmintonVariant } from "../../types";

type BadmintonCount = 1 | 2 | 3;

const defaultVariantByCount: Record<BadmintonCount, BadmintonVariant> = {
  1: "oneBadWed",
  2: "twoBadWedThu",
  3: "threeBadWedThuFri"
};

const countLabels: Record<BadmintonCount, string> = {
  1: "1 séance",
  2: "2 séances",
  3: "3 séances"
};

function getBadmintonCount(variant: BadmintonVariant): BadmintonCount {
  if (variant.startsWith("one")) return 1;
  if (variant.startsWith("three")) return 3;
  return 2;
}

function variantsForCount(count: BadmintonCount) {
  return BADMINTON_VARIANTS.filter((variant) => getBadmintonCount(variant.id) === count);
}

export function BadmintonVariantSelector({
  value,
  onChange
}: {
  value: BadmintonVariant;
  onChange: (variant: BadmintonVariant) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const activeVariant = BADMINTON_VARIANTS.find((variant) => variant.id === value);
  const activeCount = getBadmintonCount(value);
  const [selectedCount, setSelectedCount] = useState<BadmintonCount>(activeCount);
  const visibleVariants = variantsForCount(selectedCount);

  useEffect(() => {
    setSelectedCount(activeCount);
  }, [activeCount]);

  const chooseCount = (count: BadmintonCount) => {
    setSelectedCount(count);
    onChange(defaultVariantByCount[count]);
  };

  return (
    <div className="mt-4 border border-petrol-800/10 bg-white p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Badminton de la semaine</p>
          <p className="mt-1 text-xs font-bold text-muted">
            Actuel : <span className="text-petrol-800">{activeVariant?.label ?? "Configuration inconnue"}</span>
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={() => setExpanded((current) => !current)}>
          {expanded ? "Masquer" : "Changer"}
          <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 grid gap-4">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted">Nombre possible</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([1, 2, 3] as BadmintonCount[]).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`min-h-12 border px-3 text-sm font-black uppercase tracking-[0.05em] ${
                    selectedCount === count ? "border-petrol-800 bg-petrol-800 text-white" : "border-petrol-800/10 bg-mist/45 text-petrol-800"
                  }`}
                  onClick={() => chooseCount(count)}
                >
                  {countLabels[count]}
                </button>
              ))}
            </div>
          </div>

          <label className="field-label">
            Jours disponibles
            <select className="field" value={value} onChange={(event) => onChange(event.target.value as BadmintonVariant)}>
              {visibleVariants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label.replace("badmintons", "badminton")}
                </option>
              ))}
            </select>
          </label>

          <div className="border-l-4 border-limeSoft bg-mist/60 p-3 text-sm font-bold leading-6 text-ink">
            {activeVariant?.description ?? "Choisis le volume badminton, puis les jours les plus réalistes."}
            <span className="mt-1 block text-xs text-muted">
              Le jour même, l'accueil permet ensuite de choisir quelle séance de la semaine tu fais réellement.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
