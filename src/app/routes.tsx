import {
  BarChart3,
  CalendarDays,
  CalendarCheck2,
  Dumbbell,
  Home,
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

export const appRoutes = [
  {
    path: "/",
    label: "Dashboard",
    shortLabel: "Home",
    icon: Home,
    element: <DashboardPage />
  },
  {
    path: "/calendar",
    label: "Calendrier",
    shortLabel: "Cal.",
    icon: CalendarCheck2,
    element: <CalendarPage />
  },
  {
    path: "/planning",
    label: "Planning",
    shortLabel: "Plan",
    icon: CalendarDays,
    element: <PlanningPage />
  },
  {
    path: "/sessions",
    label: "Séances",
    shortLabel: "Séances",
    icon: Dumbbell,
    element: <SessionsPage />
  },
  {
    path: "/meals",
    label: "Repas",
    shortLabel: "Repas",
    icon: Utensils,
    element: <MealsPage />
  },
  {
    path: "/weight",
    label: "Poids",
    shortLabel: "Poids",
    icon: Scale,
    element: <WeightPage />
  },
  {
    path: "/stats",
    label: "Statistiques",
    shortLabel: "Stats",
    icon: BarChart3,
    element: <StatsPage />
  },
  {
    path: "/settings",
    label: "Réglages",
    shortLabel: "Régl.",
    icon: Settings,
    element: <SettingsPage />
  }
];
