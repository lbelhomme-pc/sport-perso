import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { APP_NAME } from "../../data/defaults";
import { getPrimaryRoutes, getRouteMeta } from "../../app/routes";
import { OnboardingPrompt } from "../onboarding/OnboardingPrompt";
import { useSettings } from "../../hooks/useSettings";
import { ScrollToTarget } from "./ScrollToTarget";

function navClass(isActive: boolean) {
  return `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.74rem] font-black uppercase tracking-[0.08em] transition duration-200 ${
    isActive ? "bg-petrol-800 text-white shadow-soft" : "text-petrol-800 hover:bg-white/70"
  }`;
}

export function AppLayout() {
  const { settings, saveSettings } = useSettings();
  const appIconUrl = `${import.meta.env.BASE_URL}icon.svg`;
  const location = useLocation();
  const primaryRoutes = getPrimaryRoutes(settings);
  const theme = settings.theme ?? "light";
  const isOnPrimaryRoute = primaryRoutes.some((route) =>
    route.path === "/" ? location.pathname === "/" : location.pathname.startsWith(route.path)
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen" data-theme={theme}>
      <ScrollToTarget />
      {!settings.onboardingCompleted ? <OnboardingPrompt settings={settings} onComplete={saveSettings} /> : null}
      {settings.onboardingCompleted && !settings.privacyConsentAccepted ? (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-petrol-800/10 bg-white p-4 shadow-soft lg:bottom-auto lg:top-0">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold leading-6 text-ink">
              Données locales : l'app stocke sport, récupération, nutrition et poids dans ce navigateur uniquement. Aucun backend en V1.
            </p>
            <button
              type="button"
              className="action-button justify-center"
              onClick={() =>
                saveSettings({
                  ...settings,
                  privacyConsentAccepted: true,
                  privacyConsentAt: new Date().toISOString()
                })
              }
            >
              J'accepte
            </button>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-white/60 bg-cream/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[1.15rem] shadow-soft ring-1 ring-white/80 transition hover:-translate-y-0.5 hover:shadow-lift sm:h-12 sm:w-12"
            aria-label={APP_NAME}
          >
            <img className="h-full w-full rounded-[1.15rem]" src={appIconUrl} alt="" aria-hidden="true" />
            <span className="sr-only">{APP_NAME}</span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {primaryRoutes.map((route) => (
              (() => {
                const meta = getRouteMeta(route);

                return (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) => navClass(isActive || (!isOnPrimaryRoute && route.moduleId === "profile"))}
                    end={route.path === "/"}
                  >
                    <meta.icon className="h-4 w-4" aria-hidden="true" />
                    {meta.label}
                  </NavLink>
                );
              })()
            ))}
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-petrol-800/10 bg-cream/90 px-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl lg:hidden" aria-label="Navigation mobile">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${primaryRoutes.length}, minmax(0, 1fr))` }}>
          {primaryRoutes.map((route) => (
            (() => {
              const meta = getRouteMeta(route);

              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  end={route.path === "/"}
                  className={({ isActive }) =>
                    `grid min-h-[3.35rem] place-items-center gap-1 rounded-[1.15rem] px-1 py-2 text-[0.62rem] font-black uppercase leading-none tracking-[0.06em] transition ${
                      isActive || (!isOnPrimaryRoute && route.moduleId === "profile") ? "bg-petrol-800 text-white shadow-soft" : "text-muted"
                    }`
                  }
                >
                  <meta.icon className="h-4 w-4" aria-hidden="true" />
                  {meta.shortLabel}
                </NavLink>
              );
            })()
          ))}
        </div>
      </nav>
    </div>
  );
}
