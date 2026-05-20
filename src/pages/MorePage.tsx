import { Link } from "react-router-dom";
import { Download, Settings, SlidersHorizontal, Smartphone } from "lucide-react";
import { getMoreRoutes, getRouteMeta } from "../app/routes";
import { ExperiencePanel } from "../components/profile/ExperiencePanel";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useSettings } from "../hooks/useSettings";

const moreHints: Record<string, string> = {
  "/planning": "Programme et séances prévues quand tu veux préparer ton entraînement.",
  "/sessions": "Historique sport, séance libre et saisie rapide d'un entraînement.",
  "/meals": "Journal repas, calories, macros et estimation nutrition.",
  "/calendar": "Voir les repas, pas et séances jour par jour.",
  "/weight": "Saisir une pesée et suivre la tendance.",
  "/stats": "Graphiques et tendances quand tu veux prendre du recul.",
  "/settings": "Objectifs, modules, export/import et paramètres."
};

const settingsShortcuts = [
  {
    to: "/settings#modules",
    label: "Modules",
    description: "Choisir ce qui apparaît dans l'app.",
    icon: SlidersHorizontal
  },
  {
    to: "/settings#data",
    label: "Sauvegarde",
    description: "Export, import et fusion JSON.",
    icon: Download
  },
  {
    to: "/settings#install",
    label: "Installer",
    description: "Ajouter la PWA au téléphone.",
    icon: Smartphone
  }
];

export default function MorePage() {
  const { settings, saveSettings } = useSettings();
  const moreLinks = getMoreRoutes(settings);

  return (
    <>
      <PageHeader title="Plus" />

      <ExperiencePanel settings={settings} onSave={saveSettings} />

      <SectionCard className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            to="/settings"
            className="interactive-card group flex min-h-16 items-center gap-3 rounded-card border border-petrol-800/10 bg-white p-3 shadow-sm sm:min-h-24 sm:gap-4 sm:p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center bg-petrol-800 text-limeSoft sm:h-12 sm:w-12">
              <Settings className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-black text-petrol-800">Réglages</span>
              <span className="mt-1 hidden text-sm font-semibold leading-5 text-muted sm:block">
                Modules visibles, profil sportif, sauvegarde, import/export et installation.
              </span>
            </span>
          </Link>
          {settingsShortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Link
                key={shortcut.to}
                to={shortcut.to}
                className="interactive-card group flex min-h-16 items-center gap-3 rounded-card border border-petrol-800/10 bg-white p-3 shadow-sm sm:min-h-24 sm:gap-4 sm:p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-petrol-800 text-limeSoft sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-black text-petrol-800">{shortcut.label}</span>
                  <span className="mt-1 hidden text-sm font-semibold leading-5 text-muted sm:block">{shortcut.description}</span>
                </span>
              </Link>
            );
          })}
          {moreLinks.map((item) => (
            (() => {
              const meta = getRouteMeta(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="interactive-card group flex min-h-16 items-center gap-3 rounded-card border border-petrol-800/10 bg-white p-3 shadow-sm sm:min-h-24 sm:gap-4 sm:p-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-petrol-800 text-limeSoft sm:h-12 sm:w-12">
                    <meta.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-black text-petrol-800">{meta.label}</span>
                    <span className="mt-1 hidden text-sm font-semibold leading-5 text-muted sm:block">{moreHints[item.path] ?? meta.description}</span>
                  </span>
                </Link>
              );
            })()
          ))}
        </div>
      </SectionCard>
    </>
  );
}
