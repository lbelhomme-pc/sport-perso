import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  dark?: boolean;
};

export function SectionCard({ children, className = "", dark = false }: SectionCardProps) {
  return (
    <section className={`${dark ? "panel-dark" : "panel"} ${className}`}>
      {children}
    </section>
  );
}
