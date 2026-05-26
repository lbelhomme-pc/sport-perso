import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="animate-[premiumIn_180ms_ease-out] rounded-card border border-dashed border-petrol-800/15 bg-white/70 p-6 text-center shadow-sm motion-reduce:animate-none">
      <Icon className="mx-auto h-8 w-8 text-petrol-700" aria-hidden="true" />
      <h3 className="mt-3 font-display text-xl font-black tracking-[-0.05em] text-petrol-800 sm:text-2xl">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
