import { useDailyContext } from "../hooks/useDailyContext";
import { PageHeader } from "../components/ui/PageHeader";
import { GaugeBar } from "../components/ui/GaugeBar";
import { SectionCard } from "../components/ui/SectionCard";
import type { SleepQuality } from "../types";
import { toISODate } from "../utils/dates";
import { parseOptionalReadinessScore, readinessLabel } from "../utils/readiness";

const sleepOptions: Array<{ id: SleepQuality; label: string }> = [
  { id: "good", label: "Bon" },
  { id: "medium", label: "Moyen" },
  { id: "bad", label: "Mauvais" }
];

export default function RecoveryPage() {
  const today = toISODate(new Date());
  const { dailyContext, saveDailyContext } = useDailyContext(today);
  const fatigue = dailyContext.fatigueMorning ?? 0;
  const pain = dailyContext.painMorning ?? 0;
  const recovery = Math.max(0, Math.min(100, 100 - fatigue * 7 - pain * 8 - (dailyContext.sleepQuality === "bad" ? 20 : dailyContext.sleepQuality === "medium" ? 8 : 0)));

  return (
    <>
      <PageHeader
        eyebrow="Récupération"
        title="État du jour"
        description="Au réveil, note fatigue et douleur de 1 à 10. Ces signaux adaptent la séance sans négocier avec ton ego."
      />

      <SectionCard className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="field-label">
            Fatigue au réveil / 10
            <input
              className="field"
              type="number"
              min="0"
              max="10"
              inputMode="numeric"
              value={dailyContext.fatigueMorning ?? ""}
              onChange={(event) =>
                saveDailyContext({ ...dailyContext, date: today, fatigueMorning: parseOptionalReadinessScore(event.target.value) })
              }
            />
            <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
              {readinessLabel(dailyContext.fatigueMorning)} - 0 reposé, 10 vidé.
            </span>
          </label>
          <div className="field-label">
            Sommeil
            <div className="mt-2 grid grid-cols-3 gap-2">
              {sleepOptions.map((option) => {
                const selected = (dailyContext.sleepQuality ?? "medium") === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`min-h-11 rounded-card border px-3 py-2 text-sm font-black transition ${
                      selected ? "border-petrol-800 bg-petrol-800 text-white" : "border-petrol-800/10 bg-white text-petrol-800 hover:bg-white"
                    }`}
                    aria-pressed={selected}
                    onClick={() => saveDailyContext({ ...dailyContext, date: today, sleepQuality: option.id })}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="field-label">
            Douleur au réveil / 10
            <input
              className="field"
              type="number"
              min="0"
              max="10"
              inputMode="numeric"
              value={dailyContext.painMorning ?? ""}
              onChange={(event) => saveDailyContext({ ...dailyContext, date: today, painMorning: parseOptionalReadinessScore(event.target.value) })}
            />
            <span className="text-[0.65rem] font-bold normal-case tracking-normal text-muted">
              {readinessLabel(dailyContext.painMorning)} - 0 aucune, 10 bloquante.
            </span>
          </label>
        </div>

        <div className="mt-5 grid gap-3 rounded-card bg-white/70 p-3 ring-1 ring-petrol-800/5 sm:grid-cols-3">
          <GaugeBar label="Fatigue" value={fatigue} max={10} valueLabel={fatigue ? `${fatigue}/10` : "non notée"} tone={fatigue >= 8 ? "danger" : fatigue >= 6 ? "warning" : "lime"} compact />
          <GaugeBar label="Douleur" value={pain} max={10} valueLabel={pain ? `${pain}/10` : "OK"} tone={pain >= 7 ? "danger" : pain >= 4 ? "warning" : "lime"} compact />
          <GaugeBar label="Récupération" value={recovery} valueLabel={recovery < 45 ? "allège" : recovery < 70 ? "modéré" : "OK"} tone={recovery < 45 ? "danger" : recovery < 70 ? "warning" : "lime"} compact />
        </div>

        <p className="mt-5 border-l-4 border-limeSoft bg-mist/60 p-4 text-sm font-bold leading-6 text-ink">
          {(dailyContext.painMorning ?? 0) >= 4
            ? "Douleur signalée : garde une version courte ou remplace par mobilité."
            : (dailyContext.fatigueMorning ?? 5) >= 7 || dailyContext.sleepQuality === "bad"
              ? "Récupération fragile : baisse l'intensité, garde la technique propre."
              : "Feu vert prudent : tu peux suivre le plan, sans transformer la séance en test maximal."}
        </p>
      </SectionCard>
    </>
  );
}
