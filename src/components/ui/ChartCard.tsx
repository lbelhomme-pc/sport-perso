import type { ReactNode } from "react";

type ChartCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  variant?: "panel" | "plain";
  className?: string;
};

export function ChartCard({ title, subtitle, action, children, variant = "panel", className = "" }: ChartCardProps) {
  const wrapperClass =
    variant === "plain"
      ? `min-w-0 ${className}`
      : `panel p-4 shadow-sm sm:p-5 ${className}`;

  return (
    <section className={wrapperClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-black tracking-[-0.05em] text-petrol-800">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm font-semibold leading-6 text-muted">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}
