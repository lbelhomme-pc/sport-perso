type GaugeTone = "petrol" | "lime" | "warning" | "danger" | "info";

type GaugeBarProps = {
  label: string;
  value: number;
  max?: number;
  valueLabel?: string;
  tone?: GaugeTone;
  compact?: boolean;
};

const toneClasses: Record<GaugeTone, string> = {
  petrol: "bg-petrol-800",
  lime: "bg-limeSoft",
  warning: "bg-[#F5A623]",
  danger: "bg-red-400",
  info: "bg-[#24D9D2]"
};

export function GaugeBar({ label, value, max = 100, valueLabel, tone = "petrol", compact = false }: GaugeBarProps) {
  const ratio = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={compact ? "grid gap-1.5" : "grid gap-2"}>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs font-black uppercase tracking-[0.08em] text-muted">{label}</span>
        {valueLabel ? <span className="shrink-0 text-xs font-black uppercase tracking-[0.06em] text-petrol-800">{valueLabel}</span> : null}
      </div>
      <div className={`${compact ? "h-2" : "h-3"} overflow-hidden rounded-full bg-mist/80 ring-1 ring-petrol-800/5`}>
        <div
          className={`h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none ${toneClasses[tone]}`}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}
