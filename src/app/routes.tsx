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
import DashboardPage from "../pages/DashboardPage";
import CalendarPage from "../pages/CalendarPage";
import PlanningPage from "../pages/PlanningPage";
import SessionsPage from "../pages/SessionsPage";
import MealsPage from "../pages/MealsPage";
import WeightPage from "../pages/WeightPage";
import StatsPage from "../pages/StatsPage";
import SettingsPage from "../pages/SettingsPage";
import MorePage from "../pages/MorePage";

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
    label: "Séance",
    shortLabel: "Séance",
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
