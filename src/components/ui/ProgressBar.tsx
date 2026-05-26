type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  tone?: "petrol" | "lime" | "danger";
};

export function ProgressBar({ value, max = 100, label, tone = "petrol" }: ProgressBarProps) {
  const ratio = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const color = tone === "lime" ? "bg-limeSoft" : tone === "danger" ? "bg-red-300" : "bg-petrol-800";

  return (
    <div className="grid gap-2">
      {label ? <div className="text-sm font-black uppercase tracking-[0.06em] text-muted">{label}</div> : null}
      <div className="h-3 overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none ${color}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}
