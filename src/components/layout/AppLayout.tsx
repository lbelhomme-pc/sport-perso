import { NavLink, Outlet } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { APP_NAME } from "../../data/defaults";
import { useSettings } from "../../hooks/useSettings";
import { formatShortDate, getCurrentWeekIndex, getTotalWeeks } from "../../utils/dates";
import { appRoutes } from "../../app/routes";
import { PwaInstallButton } from "../ui/PwaInstallButton";

function navClass({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
    isActive ? "bg-petrol-800 text-white" : "text-petrol-800 hover:bg-mist"
  }`;
}

export function AppLayout() {
  const { settings } = useSettings();
  const currentWeek = getCurrentWeekIndex(settings.startDate, settings.targetDate);
  const totalWeeks = getTotalWeeks(settings.startDate, settings.targetDate);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 place-items-center bg-petrol-800 text-limeSoft">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-black tracking-[-0.05em] text-petrol-800">{APP_NAME}</p>
              <p className="truncate text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted">
                Semaine {currentWeek}/{totalWeeks} - {formatShortDate(settings.targetDate)}
              </p>
            </div>
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
