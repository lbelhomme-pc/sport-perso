import { NavLink, Outlet } from "react-router-dom";
import { APP_NAME } from "../../data/defaults";
import { appRoutes } from "../../app/routes";
import { PwaInstallButton } from "../ui/PwaInstallButton";

function navClass({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
    isActive ? "bg-petrol-800 text-white" : "text-petrol-800 hover:bg-mist"
  }`;
}

export function AppLayout() {
  const appIconUrl = `${import.meta.env.BASE_URL}icon.svg`;

  return (
    <div className="min-h-screen">
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

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
              {appRoutes.map((route) => (
                <NavLink key={route.path} to={route.path} className={navClass} end={route.path === "/"}>
                  <route.icon className="h-4 w-4" aria-hidden="true" />
                  {route.label}
                </NavLink>
              ))}
            </nav>
            <PwaInstallButton />
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-petrol-800/10 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden" aria-label="Navigation mobile">
        <div className="grid grid-cols-4 gap-1">
          {appRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === "/"}
              className={({ isActive }) =>
                `grid place-items-center gap-1 px-1 py-2 text-[0.62rem] font-black uppercase tracking-[0.04em] ${
                  isActive ? "bg-petrol-800 text-white" : "text-muted"
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
