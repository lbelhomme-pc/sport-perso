import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message: string;
};

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-petrol-800/20 bg-white/70 p-6 text-center">
      <Icon className="mx-auto h-8 w-8 text-petrol-700" aria-hidden="true" />
      <h3 className="mt-3 font-display text-2xl font-black tracking-[-0.05em] text-petrol-800">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-muted">{message}</p>
    </div>
  );
}
