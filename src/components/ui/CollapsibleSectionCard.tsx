import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleSectionCardProps = {
  eyebrow: string;
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  dark?: boolean;
};

export function CollapsibleSectionCard({
  eyebrow,
  title,
  summary,
  children,
  defaultOpen = false,
  className = "",
  dark = false
}: CollapsibleSectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className={`group ${dark ? "panel-dark" : "panel"} ${className}`}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer list-none p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={dark ? "text-[0.68rem] font-black uppercase tracking-[0.18em] text-limeSoft" : "eyebrow"}>{eyebrow}</p>
            <h2 className={dark ? "mt-2 font-display text-3xl font-black tracking-[-0.06em] text-white" : "title-lg mt-2"}>{title}</h2>
            {summary ? <p className={dark ? "mt-2 text-sm font-semibold leading-6 text-white/70" : "mt-2 text-sm font-semibold leading-6 text-muted"}>{summary}</p> : null}
          </div>
          <span className={dark ? "chip bg-white/10 text-white" : "chip bg-white"}>
            {open ? "Fermer" : "Ouvrir"}
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </span>
        </div>
      </summary>
      <div className="border-t border-petrol-800/10 p-5 pt-0 sm:p-6 sm:pt-0">{children}</div>
    </details>
  );
}
