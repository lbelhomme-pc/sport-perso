import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BADMINTON_VARIANTS } from "../../data/defaults";
import type { BadmintonVariant } from "../../types";

export function BadmintonVariantSelector({
  value,
  onChange
}: {
  value: BadmintonVariant;
  onChange: (variant: BadmintonVariant) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const activeVariant = BADMINTON_VARIANTS.find((variant) => variant.id === value);

  return (
    <div className="mt-4 border border-petrol-800/10 bg-white p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Configuration compétition HYROX</p>
          <p className="mt-1 text-xs font-bold text-muted">
            Active : <span className="text-petrol-800">{activeVariant?.label ?? "Configuration inconnue"}</span>
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={() => setExpanded((current) => !current)}>
          {expanded ? "Masquer les options" : "Choisir une config"}
          <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {BADMINTON_VARIANTS.map((variant) => {
            const active = variant.id === value;

            return (
              <button
                key={variant.id}
                type="button"
                className={`min-h-24 border p-3 text-left transition ${
                  active ? "border-petrol-800 bg-petrol-800 text-white" : "border-petrol-800/10 bg-mist/45 text-petrol-800 hover:border-petrol-800/35"
                }`}
                onClick={() => onChange(variant.id)}
              >
                <span className={active ? "text-[0.65rem] font-black uppercase tracking-[0.14em] text-limeSoft" : "text-[0.65rem] font-black uppercase tracking-[0.14em] text-muted"}>
                  {variant.shortLabel}
                </span>
                <span className="mt-2 block text-sm font-black leading-5">{variant.label}</span>
                <span className={active ? "mt-2 block text-xs font-bold leading-5 text-white/65" : "mt-2 block text-xs font-bold leading-5 text-muted"}>
                  {variant.description}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
