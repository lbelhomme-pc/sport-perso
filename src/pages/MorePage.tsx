import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { getMoreRoutes, getRouteMeta } from "../app/routes";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useSettings } from "../hooks/useSettings";

const moreHints: Record<string, string> = {
  "/planning": "Programme et séances prévues quand tu veux préparer ton entraînement.",
  "/sessions": "Historique sport, séance libre et saisie rapide d'un entraînement.",
  "/meals": "Journal repas, calories, macros et estimation nutrition.",
  "/calendar": "Voir les habitudes, repas, pas et séances jour par jour.",
  "/weight": "Saisir une pesée et suivre la tendance.",
  "/stats": "Graphiques et tendances quand tu veux prendre du recul.",
  "/settings": "Objectifs, onglets favoris, export/import et paramètres."
};

export default function MorePage() {
  const { settings } = useSettings();
  const moreLinks = getMoreRoutes(settings);

  return (
    <>
      <PageHeader
        eyebrow="Plus"
        title="Le reste, sans encombrer"
        description="Les onglets principaux suivent ton choix de départ. Les outils qui ne t'intéressent pas sont retirés au lieu d'être cachés ici."
      />

      <SectionCard className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/settings"
            className="group flex min-h-24 items-center gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-petrol-800/25"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
              <Settings className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-black text-petrol-800">Réglages</span>
              <span className="mt-1 block text-sm font-semibold leading-5 text-muted">
                Modules visibles, profil sportif, sauvegarde, import/export et installation.
              </span>
            </span>
          </Link>
          {moreLinks.map((item) => (
            (() => {
              const meta = getRouteMeta(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex min-h-24 items-center gap-4 border border-petrol-800/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-petrol-800/25"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center bg-petrol-800 text-limeSoft">
                    <meta.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-black text-petrol-800">{meta.label}</span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-muted">{moreHints[item.path] ?? meta.description}</span>
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
