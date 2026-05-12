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
    primaryNav: true,
    element: <DashboardPage />
  },
  {
    path: "/planning",
    label: "Programme",
    shortLabel: "Prog.",
    icon: CalendarDays,
    primaryNav: true,
    element: <PlanningPage />
  },
  {
    path: "/sessions",
    label: "Sport",
    shortLabel: "Sport",
    icon: Dumbbell,
    primaryNav: true,
    element: <SessionsPage />
  },
  {
    path: "/meals",
    label: "Nutrition",
    shortLabel: "Repas",
    icon: Utensils,
    primaryNav: true,
    element: <MealsPage />
  },
  {
    path: "/more",
    label: "Plus",
    shortLabel: "Plus",
    icon: MoreHorizontal,
    primaryNav: true,
    element: <MorePage />
  },
  {
    path: "/calendar",
    label: "Calendrier",
    shortLabel: "Cal.",
    icon: CalendarCheck2,
    primaryNav: false,
    element: <CalendarPage />
  },
  {
    path: "/weight",
    label: "Poids",
    shortLabel: "Poids",
    icon: Scale,
    primaryNav: false,
    element: <WeightPage />
  },
  {
    path: "/stats",
    label: "Progression",
    shortLabel: "Stats",
    icon: BarChart3,
    primaryNav: false,
    element: <StatsPage />
  },
  {
    path: "/settings",
    label: "Profil",
    shortLabel: "Profil",
    icon: Settings,
    primaryNav: false,
    element: <SettingsPage />
  }
];

const primaryPathsByFocus: Record<NavigationFocus, string[]> = {
  both: ["/", "/planning", "/sessions", "/meals", "/more"],
  sport: ["/", "/planning", "/sessions", "/calendar", "/more"],
  nutrition: ["/", "/meals", "/weight", "/stats", "/more"]
};

function routeByPath(path: string) {
  return appRoutes.find((route) => route.path === path);
}

export function getPrimaryRoutes(focus: NavigationFocus = "both") {
  return primaryPathsByFocus[focus].map(routeByPath).filter((route): route is NonNullable<ReturnType<typeof routeByPath>> => Boolean(route));
}

export function getMoreRoutes(focus: NavigationFocus = "both") {
  const primaryPaths = new Set(primaryPathsByFocus[focus]);
  return appRoutes.filter((route) => route.path !== "/" && route.path !== "/more" && !primaryPaths.has(route.path));
}
