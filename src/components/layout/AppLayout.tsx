import { NavLink, Outlet, useLocation } from "react-router-dom";
import { APP_NAME } from "../../data/defaults";
import { appRoutes } from "../../app/routes";
import { OnboardingPrompt } from "../onboarding/OnboardingPrompt";
import { useSettings } from "../../hooks/useSettings";

function navClass(isActive: boolean) {
  return `inline-flex items-center gap-2 px-3 py-2 text-sm font-black uppercase tracking-[0.06em] transition ${
    isActive ? "bg-petrol-800 text-white" : "text-petrol-800 hover:bg-mist"
  }`;
}

export function AppLayout() {
  const { settings, saveSettings } = useSettings();
  const appIconUrl = `${import.meta.env.BASE_URL}icon.svg`;
  const location = useLocation();
  const primaryRoutes = appRoutes.filter((route) => route.primaryNav);
  const isOnPrimaryRoute = primaryRoutes.some((route) =>
    route.path === "/" ? location.pathname === "/" : location.pathname.startsWith(route.path)
  );

  return (
    <div className="min-h-screen">
      {!settings.onboardingCompleted ? <OnboardingPrompt settings={settings} onComplete={saveSettings} /> : null}

      <header className="sticky top-0 z-40 border-b border-white/70 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.15rem] shadow-soft transition hover:-translate-y-0.5 sm:h-14 sm:w-14"
            aria-label={APP_NAME}
          >
            <img className="h-full w-full rounded-[1.15rem]" src={appIconUrl} alt="" aria-hidden="true" />
            <span className="sr-only">{APP_NAME}</span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {primaryRoutes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => navClass(isActive || (route.path === "/more" && !isOnPrimaryRoute))}
                end={route.path === "/"}
              >
                <route.icon className="h-4 w-4" aria-hidden="true" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-petrol-800/10 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden" aria-label="Navigation mobile">
        <div className="grid grid-cols-5 gap-1">
          {primaryRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === "/"}
              className={({ isActive }) =>
                `grid min-h-16 place-items-center gap-1 px-1 py-2 text-[0.8rem] font-black uppercase tracking-[0.02em] ${
                  isActive || (route.path === "/more" && !isOnPrimaryRoute) ? "bg-petrol-800 text-white" : "text-muted"
                }`
              }
            >
              <route.icon className="h-4 w-4" aria-hidden="true" />
              {route.shortLabel}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
