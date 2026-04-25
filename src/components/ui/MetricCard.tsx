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
    <article className={`${toneClass} border border-petrol-800/10 p-4 shadow-soft`}>
      <p className={`text-[0.68rem] font-black uppercase tracking-[0.14em] ${tone === "dark" ? "text-white/70" : "text-muted"}`}>
        {label}
      </p>
      <div className="mt-2 font-display text-3xl font-black tracking-[-0.06em]">{value}</div>
      {hint ? <div className={`mt-2 text-sm font-semibold ${tone === "dark" ? "text-white/70" : "text-muted"}`}>{hint}</div> : null}
    </article>
  );
}
