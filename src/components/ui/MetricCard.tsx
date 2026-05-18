import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "lime" | "dark";
};

export function MetricCard({ label, value, hint, tone = "default" }: MetricCardProps) {
  const toneClass =
    tone === "dark"
      ? "bg-petrol-800 text-white"
      : tone === "lime"
        ? "bg-limeSoft text-petrol-900"
        : "bg-white text-ink";

  return (
    <article className={`${toneClass} rounded-card border border-petrol-800/10 p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift`}>
      <p className={`text-[0.68rem] font-black uppercase tracking-[0.14em] ${tone === "dark" ? "text-white/70" : "text-muted"}`}>
        {label}
      </p>
      <div className="mt-2 font-display text-2xl font-black tracking-[-0.06em] sm:text-3xl">{value}</div>
      {hint ? <div className={`mt-2 text-xs font-bold leading-5 ${tone === "dark" ? "text-white/65" : "text-muted"}`}>{hint}</div> : null}
    </article>
  );
}
