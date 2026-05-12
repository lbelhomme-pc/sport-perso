import { lazy } from "react";
import {
  BarChart3,
  CalendarDays,
  CalendarCheck2,
  Dumbbell,
  Home,
  MoreHorizontal,
  Scale,
  Settings,
  Utensils
} from "lucide-react";
import type { NavigationFocus } from "../types";
import { wantsNutrition, wantsSport } from "../utils/navigationFocus";

type RouteInterest = "always" | "sport" | "nutrition" | "shared";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const PlanningPage = lazy(() => import("../pages/PlanningPage"));
const SessionsPage = lazy(() => import("../pages/SessionsPage"));
const MealsPage = lazy(() => import("../pages/MealsPage"));
const WeightPage = lazy(() => import("../pages/WeightPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const MorePage = lazy(() => import("../pages/MorePage"));

export const appRoutes = [
  {
    path: "/",
    label: "Aujourd'hui",
    shortLabel: "Auj.",
    icon: Home,
    interest: "always" as RouteInterest,
    primaryNav: true,
    element: <DashboardPage />
  },
  {
    path: "/planning",
    label: "Programme",
    shortLabel: "Prog.",
    icon: CalendarDays,
    interest: "sport" as RouteInterest,
    primaryNav: true,
    element: <PlanningPage />
  },
  {
    path: "/sessions",
    label: "Sport",
    shortLabel: "Sport",
    icon: Dumbbell,
    interest: "sport" as RouteInterest,
    primaryNav: true,
    element: <SessionsPage />
  },
  {
    path: "/meals",
    label: "Nutrition",
    shortLabel: "Repas",
    icon: Utensils,
    interest: "nutrition" as RouteInterest,
    primaryNav: true,
    element: <MealsPage />
  },
  {
    path: "/more",
    label: "Plus",
    shortLabel: "Plus",
    icon: MoreHorizontal,
    interest: "always" as RouteInterest,
    primaryNav: true,
    element: <MorePage />
  },
  {
    path: "/calendar",
    label: "Calendrier",
    shortLabel: "Cal.",
    icon: CalendarCheck2,
    interest: "shared" as RouteInterest,
    primaryNav: false,
    element: <CalendarPage />
  },
  {
    path: "/weight",
    label: "Poids",
    shortLabel: "Poids",
    icon: Scale,
    interest: "nutrition" as RouteInterest,
    primaryNav: false,
    element: <WeightPage />
  },
  {
    path: "/stats",
    label: "Progression",
    shortLabel: "Stats",
    icon: BarChart3,
    interest: "shared" as RouteInterest,
    primaryNav: false,
    element: <StatsPage />
  },
  {
    path: "/settings",
    label: "Profil",
    shortLabel: "Profil",
    icon: Settings,
    interest: "shared" as RouteInterest,
    primaryNav: false,
    element: <SettingsPage />
  }
];

const primaryPathsByFocus: Record<NavigationFocus, string[]> = {
  both: ["/", "/planning", "/sessions", "/meals", "/calendar", "/more"],
  sport: ["/", "/planning", "/sessions", "/calendar", "/more"],
  nutrition: ["/", "/meals", "/weight", "/calendar", "/more"]
};

function routeByPath(path: string) {
  return appRoutes.find((route) => route.path === path);
}

export function getPrimaryRoutes(focus: NavigationFocus = "both") {
  return primaryPathsByFocus[focus].map(routeByPath).filter((route): route is NonNullable<ReturnType<typeof routeByPath>> => Boolean(route));
}

export function getMoreRoutes(focus: NavigationFocus = "both") {
  const primaryPaths = new Set(primaryPathsByFocus[focus]);
  return appRoutes.filter((route) => {
    if (route.path === "/" || route.path === "/more" || primaryPaths.has(route.path)) return false;
    if (route.interest === "sport" && !wantsSport(focus)) return false;
    if (route.interest === "nutrition" && !wantsNutrition(focus)) return false;
    return true;
  });
}
