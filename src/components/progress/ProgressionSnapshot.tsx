import { Award, Gauge, Lightbulb, TrendingUp } from "lucide-react";
import type { MotivationTone, SportProgressionSummary } from "../../services/progressionService";

const motivationToneClasses: Record<MotivationTone, string> = {
  positive: "border-limeSoft/60 bg-limeSoft/35",
  care: "border-red-900/10 bg-red-50",
  neutral: "border-petrol-800/10 bg-white/75"
};

const motivationIconClasses: Record<MotivationTone, string> = {
  positive: "bg-limeSoft text-petrol-900",
  care: "bg-red-900/10 text-red-950",
  neutral: "bg-mist text-petrol-800"
};

export function ProgressionSnapshot({ summary, compact = false }: { summary: SportProgressionSummary; compact?: boolean }) {
  const visibleMessages = summary.motivationMessages.slice(0, compact ? 1 : 3);
  const earnedBadges = summary.badges.filter((badge) => badge.earned).slice(0, compact ? 3 : 6);

  return (
    <div className="grid gap-4">
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"}`}>
        <div className="border border-petrol-800/10 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">Volume 7 j</p>
          <p className="mt-1 font-display text-3xl font-black tracking-[-0.05em] text-petrol-800">{summary.volume7d} min</p>
          <p className="mt-1 text-sm font-bold text-muted">{summary.activeDays7d} jour(s) actif(s)</p>
        </div>
        <div className="border border-petrol-800/10 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">RPE moyen</p>
          <p className="mt-1 font-display text-3xl font-black tracking-[-0.05em] text-petrol-800">
            {summary.averageRpe7d || "n/a"}
          </p>
          <p className="mt-1 text-sm font-bold text-muted">sur les séances notées</p>
        </div>
      </div>

      <div className="border-l-4 border-limeSoft bg-mist/55 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
            <Gauge className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-bold leading-6 text-ink">{summary.coachingMessage}</p>
        </div>
      </div>

      {visibleMessages.length ? (
        <div className={`grid gap-2 ${compact ? "" : "md:grid-cols-3"}`}>
          {visibleMessages.map((message) => (
            <article key={message.id} className={`rounded-card border p-3 shadow-sm ${motivationToneClasses[message.tone]}`}>
              <div className="flex items-start gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${motivationIconClasses[message.tone]}`}>
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-petrol-800">{message.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-muted">{message.message}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {summary.records.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {summary.records.slice(0, compact ? 2 : 4).map((record) => (
            <div key={`${record.label}-${record.value}`} className="border border-petrol-800/10 bg-white p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-muted">
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> {record.label}
              </p>
              <p className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{record.value}</p>
              <p className="mt-1 text-xs font-bold text-muted">{record.hint}</p>
            </div>
          ))}
        </div>
      ) : null}

      {earnedBadges.length ? (
        <div className="flex flex-wrap gap-2">
          {earnedBadges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-2 rounded-full bg-limeSoft px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-petrol-900"
              title={badge.hint}
            >
              <Award className="h-4 w-4" aria-hidden="true" />
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
