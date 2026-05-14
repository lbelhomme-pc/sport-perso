import { Link } from "react-router-dom";
import { modulesConfig } from "../data/modules";
import type { AppModuleId } from "../types";

type ModuleDisabledPageProps = {
  moduleId: AppModuleId;
  onEnable: () => void;
};

export default function ModuleDisabledPage({ moduleId, onEnable }: ModuleDisabledPageProps) {
  const module = modulesConfig[moduleId];

  return (
    <section className="panel p-5 sm:p-8">
      <p className="eyebrow">Module désactivé</p>
      <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.07em] text-petrol-800">{module.label}</h1>
      <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted">
        Ce module n'est pas actif dans ta configuration actuelle. Tu peux le réactiver maintenant ou le gérer plus finement dans Profil.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="action-button justify-center" onClick={onEnable}>
          Activer {module.label}
        </button>
        <Link to="/settings" className="ghost-button justify-center">
          Personnaliser mes modules
        </Link>
      </div>
    </section>
  );
}
