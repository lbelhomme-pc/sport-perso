import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleSectionCardProps = {
  eyebrow?: string;
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  dark?: boolean;
  id?: string;
};

export function CollapsibleSectionCard({
  eyebrow,
  title,
  summary,
  children,
  defaultOpen = false,
  className = "",
  dark = false,
  id
}: CollapsibleSectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const generatedId = useId();
  const contentId = `${id ?? generatedId}-content`;

  return (
    <section id={id} className={`${dark ? "panel-dark" : "panel"} ${className}`}>
      <button
        type="button"
        className="w-full cursor-pointer p-4 text-left transition duration-200 ease-out hover:bg-white/[0.42] active:bg-white/[0.58] sm:p-5"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {eyebrow ? <p className={dark ? "text-xs font-black uppercase tracking-[0.14em] text-limeSoft" : "eyebrow"}>{eyebrow}</p> : null}
            <h2 className={dark ? `${eyebrow ? "mt-1.5 " : ""}font-display text-2xl font-black tracking-[-0.06em] text-white` : `${eyebrow ? "mt-1.5 " : ""}title-lg`}>
              {title}
            </h2>
            {summary ? <p className={dark ? "mt-2 hidden text-sm font-semibold leading-6 text-white/70 sm:block" : "mt-2 hidden text-sm font-semibold leading-6 text-muted sm:block"}>{summary}</p> : null}
          </div>
          <span className={dark ? "chip bg-white/10 text-white" : "chip bg-white/80"}>
            {open ? "Masquer" : "Détails"}
            <ChevronDown className={`h-4 w-4 transition duration-200 ease-out ${open ? "rotate-180" : ""}`} />
          </span>
        </div>
      </button>
      <div
        id={contentId}
        aria-hidden={!open}
        inert={open ? undefined : true}
        className={`grid transition-[grid-template-rows,opacity] duration-[220ms] ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-petrol-800/10 p-4 pt-0 sm:p-5 sm:pt-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
