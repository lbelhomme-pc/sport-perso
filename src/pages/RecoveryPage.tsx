import { useDailyContext } from "../hooks/useDailyContext";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import type { EnergyLevel, SleepQuality } from "../types";
import { toISODate } from "../utils/dates";

export default function RecoveryPage() {
  const today = toISODate(new Date());
  const { dailyContext, saveDailyContext } = useDailyContext(today);

  return (
    <>
      <PageHeader
        eyebrow="Récupération"
        title="État du jour"
        description="Sommeil, fatigue et douleur : trois signaux simples pour adapter la séance sans négocier avec ton ego."
      />

      <SectionCard className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="field-label">
            Fatigue
            <select
              className="field"
              value={dailyContext.energyLevel}
              onChange={(event) =>
                saveDailyContext({ ...dailyContext, date: today, energyLevel: event.target.value as EnergyLevel })
              }
            >
              <option value="strong">Faible</option>
              <option value="normal">Normale</option>
              <option value="fatigue">Élevée</option>
            </select>
          </label>
          <label className="field-label">
            Sommeil
            <select
              className="field"
              value={dailyContext.sleepQuality ?? "medium"}
              onChange={(event) =>
                saveDailyContext({ ...dailyContext, date: today, sleepQuality: event.target.value as SleepQuality })
              }
            >
              <option value="good">Bon</option>
              <option value="medium">Moyen</option>
              <option value="bad">Mauvais</option>
            </select>
          </label>
          <label className="field-label">
            Douleur
            <select
              className="field"
              value={dailyContext.pain ? "yes" : "no"}
              onChange={(event) => saveDailyContext({ ...dailyContext, date: today, pain: event.target.value === "yes" })}
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
        </div>

        <p className="mt-5 border-l-4 border-limeSoft bg-mist/60 p-4 text-sm font-bold leading-6 text-ink">
          {dailyContext.pain
            ? "Douleur signalée : garde une version courte ou remplace par mobilité."
            : dailyContext.energyLevel === "fatigue" || dailyContext.sleepQuality === "bad"
              ? "Récupération fragile : baisse l'intensité, garde la technique propre."
              : "Feu vert prudent : tu peux suivre le plan, sans transformer la séance en test maximal."}
        </p>
      </SectionCard>
    </>
  );
}
