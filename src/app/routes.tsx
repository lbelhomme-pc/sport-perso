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
