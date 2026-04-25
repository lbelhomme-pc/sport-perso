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
      {label ? <div className="text-xs font-black uppercase tracking-[0.12em] text-muted">{label}</div> : null}
      <div className="h-3 overflow-hidden bg-mist">
        <div className={`h-full ${color}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}
