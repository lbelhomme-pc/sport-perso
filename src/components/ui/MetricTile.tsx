import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type MetricTileTone = "default" | "lime" | "dark" | "muted" | "warning" | "danger" | "info";

type MetricTileProps = {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: LucideIcon;
  tone?: MetricTileTone;
  className?: string;
};

const toneClasses: Record<MetricTileTone, string> = {
  default: "bg-white/75 text-ink ring-petrol-800/10",
  lime: "bg-limeSoft/75 text-petrol-900 ring-limeSoft/60",
  dark: "bg-petrol-800 text-white ring-white/10",
  muted: "bg-mist/60 text-ink ring-petrol-800/10",
  warning: "bg-[#F5A623]/15 text-petrol-900 ring-[#F5A623]/20",
  danger: "bg-red-50 text-red-950 ring-red-900/10",
  info: "bg-[#24D9D2]/12 text-petrol-800 ring-[#24D9D2]/20"
};

export function MetricTile({ label, value, hint, icon: Icon, tone = "default", className = "" }: MetricTileProps) {
  const mutedClass = tone === "dark" ? "text-white/70" : tone === "danger" ? "text-red-950/70" : "text-muted";

  return (
    <article className={`min-w-0 rounded-card p-3 shadow-sm ring-1 transition duration-200 ease-out ${toneClasses[tone]} ${className}`}>
      <div className="flex min-w-0 items-center gap-2">
        {Icon ? (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone === "dark" ? "bg-white/10" : "bg-white/70"}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
        <p className={`truncate text-xs font-black uppercase tracking-[0.06em] ${mutedClass}`}>{label}</p>
      </div>
      <div className="mt-2 truncate font-display text-xl font-black leading-none tracking-[-0.05em] sm:text-2xl">{value}</div>
      {hint ? <p className={`mt-1 truncate text-xs font-bold leading-5 ${mutedClass}`}>{hint}</p> : null}
    </article>
  );
}
