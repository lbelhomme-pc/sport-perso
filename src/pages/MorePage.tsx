import { Link } from "react-router-dom";
import { Download, Settings, SlidersHorizontal, Smartphone } from "lucide-react";
import { getMoreRoutes, getRouteMeta } from "../app/routes";
import { ExperiencePanel } from "../components/profile/ExperiencePanel";
import { CollapsibleSectionCard } from "../components/ui/CollapsibleSectionCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useSettings } from "../hooks/useSettings";

const drawerLinks = [
  {
    to: "#experience",
    label: "Mon expérience",
    description: "Objectifs, modules et onglets.",
    icon: SlidersHorizontal
  },
  {
    to: "/settings",
    label: "Réglages",
    description: "Profil et préférences.",
    icon: Settings
  },
  {
    to: "/settings#data",
    label: "Données",
    description: "Export, fusion et import.",
    icon: Download
  },
  {
    to: "/settings#install",
    label: "Installer",
    description: "Ajouter l'app au téléphone.",
    icon: Smartphone
  }
];

function DrawerLink({ item }: { item: (typeof drawerLinks)[number] }) {
  const Icon = item.icon;
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center bg-petrol-800 text-limeSoft sm:h-12 sm:w-12">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-black text-petrol-800">{item.label}</span>
        <span className="mt-1 block text-xs font-bold leading-5 text-muted sm:text-sm">{item.description}</span>
      </span>
    </>
  );

  const className = "interactive-card flex min-h-16 items-center gap-3 rounded-card border border-petrol-800/10 bg-white p-3 shadow-sm sm:min-h-24 sm:gap-4 sm:p-4";

  if (item.to.startsWith("#")) {
    return (
      <a href={item.to} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={item.to} className={className}>
      {content}
    </Link>
  );
}

export default function MorePage() {
  const { settings, saveSettings } = useSettings();
  const moreLinks = getMoreRoutes(settings);

  return (
    <>
      <PageHeader title="Plus" />

      <SectionCard className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2">
          {drawerLinks.map((item) => (
            <DrawerLink key={item.to} item={item} />
          ))}
        </div>
      </SectionCard>

      <ExperiencePanel settings={settings} onSave={saveSettings} />

      {moreLinks.length ? (
        <CollapsibleSectionCard title="Modules actifs" summary={`${moreLinks.length} accès hors menu principal`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {moreLinks.map((item) => {
              const meta = getRouteMeta(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="interactive-card flex min-h-14 items-center gap-3 rounded-card border border-petrol-800/10 bg-white/80 p-3 shadow-sm"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
                    <meta.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 text-sm font-black text-petrol-800">{meta.label}</span>
                </Link>
              );
            })}
          </div>
        </CollapsibleSectionCard>
      ) : null}
    </>
  );
}
