import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type StatusBadgeTone = "default" | "lime" | "dark" | "muted" | "warning" | "danger" | "info";

type StatusBadgeProps = {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: StatusBadgeTone;
  className?: string;
  title?: string;
};

const toneClasses: Record<StatusBadgeTone, string> = {
  default: "bg-sage text-petrol-800",
  lime: "bg-limeSoft text-petrol-900",
  dark: "bg-petrol-800 text-white",
  muted: "bg-white/80 text-muted ring-1 ring-petrol-800/10",
  warning: "bg-[#F5A623]/15 text-petrol-900 ring-1 ring-[#F5A623]/20",
  danger: "bg-red-50 text-red-950 ring-1 ring-red-900/10",
  info: "bg-[#24D9D2]/12 text-petrol-800 ring-1 ring-[#24D9D2]/20"
};

export function StatusBadge({ children, icon: Icon, tone = "default", className = "", title }: StatusBadgeProps) {
  return (
    <span title={title} className={`inline-flex max-w-full items-center gap-1.5 break-words rounded-full px-3 py-1.5 text-xs font-black uppercase leading-tight tracking-[0.06em] transition duration-200 ease-out ${toneClasses[tone]} ${className}`}>
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
