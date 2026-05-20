import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

type ModuleToggleProps = {
  icon: LucideIcon;
  label: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  statusLabel: string;
  onToggle: () => void;
};

export function ModuleToggle({ icon: Icon, label, description, enabled, locked = false, statusLabel, onToggle }: ModuleToggleProps) {
  return (
    <article className={`interactive-card rounded-card border p-4 shadow-sm ${enabled ? "border-petrol-800/15 bg-white/85" : "border-petrol-800/10 bg-mist/45 opacity-80"}`}>
      <div className="flex gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${enabled ? "bg-petrol-800 text-limeSoft" : "bg-white/70 text-muted"}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{label}</h3>
            <StatusBadge tone={enabled ? "lime" : "muted"}>{statusLabel}</StatusBadge>
          </div>
          <p className="mt-1 text-sm font-semibold leading-5 text-muted">{description}</p>
        </div>
      </div>

      <button
        type="button"
        className={`mt-4 ${enabled ? "action-button" : "ghost-button"} justify-center`}
        disabled={locked}
        onClick={onToggle}
      >
        {locked ? "Toujours actif" : enabled ? "Désactiver" : "Activer"}
      </button>
    </article>
  );
}
