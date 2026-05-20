import type { ReactNode } from "react";

type ActionPanelProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function ActionPanel({
  eyebrow,
  title,
  description,
  meta,
  primaryAction,
  secondaryAction,
  children,
  className = ""
}: ActionPanelProps) {
  return (
    <section className={`panel p-4 ring-1 ring-limeSoft/35 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {meta ? <div className="mt-1 text-sm font-bold text-muted">{meta}</div> : null}
          <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-[-0.06em] text-petrol-800 sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <div className="mt-3 rounded-card bg-mist/60 p-3 text-sm font-bold leading-6 text-ink ring-1 ring-petrol-800/5">
              {description}
            </div>
          ) : null}
        </div>
      </div>

      {(primaryAction || secondaryAction) ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
