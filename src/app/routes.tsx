import { lazy } from "react";
import type { ReactElement } from "react";
import { modulesConfig, resolveModulePreferences } from "../data/modules";
import type { AppModuleId, Settings } from "../types";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const PlanningPage = lazy(() => import("../pages/PlanningPage"));
const SessionsPage = lazy(() => import("../pages/SessionsPage"));
const MealsPage = lazy(() => import("../pages/MealsPage"));
const WeightPage = lazy(() => import("../pages/WeightPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const RecoveryPage = lazy(() => import("../pages/RecoveryPage"));
const MorePage = lazy(() => import("../pages/MorePage"));

export type AppRoute = {
  path: string;
  moduleId: AppModuleId;
  element: ReactElement;
};

export const appRoutes: AppRoute[] = [
  { path: "/", moduleId: "home", element: <DashboardPage /> },
  { path: "/planning", moduleId: "training", element: <PlanningPage /> },
  { path: "/sessions", moduleId: "sessions", element: <SessionsPage /> },
  { path: "/meals", moduleId: "nutrition", element: <MealsPage /> },
  { path: "/nutrition", moduleId: "nutrition", element: <MealsPage /> },
  { path: "/calendar", moduleId: "calendar", element: <CalendarPage /> },
  { path: "/weight", moduleId: "weight", element: <WeightPage /> },
  { path: "/stats", moduleId: "progress", element: <StatsPage /> },
  { path: "/recovery", moduleId: "recovery", element: <RecoveryPage /> },
  { path: "/settings", moduleId: "profile", element: <SettingsPage /> },
  { path: "/more", moduleId: "profile", element: <MorePage /> }
];

export function getRouteMeta(route: AppRoute) {
  return modulesConfig[route.moduleId];
}

export function getRouteByModule(moduleId: AppModuleId) {
  return appRoutes.find((route) => route.moduleId === moduleId);
}

export function getPrimaryRoutes(settings: Settings) {
  const { primaryModuleTabs } = resolveModulePreferences(settings);
  return primaryModuleTabs.map(getRouteByModule).filter((route): route is AppRoute => Boolean(route));
}

export function getMoreRoutes(settings: Settings) {
  const { enabledModules, primaryModuleTabs } = resolveModulePreferences(settings);
  const primarySet = new Set(primaryModuleTabs);

  return enabledModules
    .filter((moduleId) => !primarySet.has(moduleId))
    .map(getRouteByModule)
    .filter((route): route is AppRoute => Boolean(route));
}
