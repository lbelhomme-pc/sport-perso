import { useDailyContext } from "../hooks/useDailyContext";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import type { SleepQuality } from "../types";
import { toISODate } from "../utils/dates";
import { parseOptionalReadinessScore, readinessLabel } from "../utils/readiness";

export default function RecoveryPage() {
  const today = toISODate(new Date());
  const { dailyContext, saveDailyContext } = useDailyContext(today);

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
