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
    label: "Accueil",
    shortLabel: "Home",
    icon: Home,
    element: <DashboardPage />
  },
  {
    path: "/calendar",
    label: "Agenda",
    shortLabel: "Cal.",
    icon: CalendarCheck2,
    element: <CalendarPage />
  },
  {
    path: "/planning",
    label: "Programmes",
    shortLabel: "Prog.",
    icon: CalendarDays,
    element: <PlanningPage />
  },
  {
    path: "/sessions",
    label: "Séances",
    shortLabel: "Sport",
    icon: Dumbbell,
    element: <SessionsPage />
  },
  {
    path: "/meals",
    label: "Nutrition",
    shortLabel: "Repas",
    icon: Utensils,
    element: <MealsPage />
  },
  {
    path: "/weight",
    label: "Corps",
    shortLabel: "Corps",
    icon: Scale,
    element: <WeightPage />
  },
  {
    path: "/stats",
    label: "Progression",
    shortLabel: "Stats",
    icon: BarChart3,
    element: <StatsPage />
  },
  {
    path: "/settings",
    label: "Profil",
    shortLabel: "Profil",
    icon: Settings,
    element: <SettingsPage />
  }
];
