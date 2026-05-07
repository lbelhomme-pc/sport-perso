import { Link } from "react-router-dom";
import { CalendarCheck2, Scale, Settings, BarChart3 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";

const moreLinks = [
  {
    to: "/calendar",
    icon: CalendarCheck2,
    label: "Calendrier",
    hint: "Voir les habitudes, repas et séances jour par jour."
  },
  {
    to: "/weight",
    icon: Scale,
    label: "Poids",
    hint: "Saisir une pesée et suivre la tendance."
  },
  {
    to: "/stats",
    icon: BarChart3,
    label: "Progression",
    hint: "Graphiques et tendances quand tu veux prendre du recul."
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Profil et réglages",
    hint: "Objectifs, export/import, compétition et paramètres."
  }
];

export default function MorePage() {
  return (
    <>
      <PageHeader
        eyebrow="Plus"
        title="Outils secondaires"
        description="Les actions fréquentes restent dans les 4 premiers onglets. Ici, tu retrouves le calendrier, le poids, les stats et les réglages."
      />

      <SectionCard className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {moreLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex min-h-24 items-center gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-petrol-800/25"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-black text-petrol-800">{item.label}</span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-muted">{item.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
