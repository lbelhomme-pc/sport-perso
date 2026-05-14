import { Suspense } from "react";
import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { appRoutes } from "./routes";
import { MAX_PRIMARY_TABS, deriveNavigationFocusFromModules, isModuleEnabled, resolveModulePreferences } from "../data/modules";
import ModuleDisabledPage from "../pages/ModuleDisabledPage";
import { useSettings } from "../hooks/useSettings";
import type { AppModuleId } from "../types";

function ModuleRoute({ moduleId, element }: { moduleId: AppModuleId; element: ReactElement }) {
  const { settings, saveSettings } = useSettings();

  if (!isModuleEnabled(settings, moduleId)) {
    const modulePrefs = resolveModulePreferences(settings);
    const nextEnabledModules = [...new Set<AppModuleId>([...modulePrefs.enabledModules, moduleId])];
    const nextPrimaryTabs =
      modulePrefs.primaryModuleTabs.includes(moduleId) || modulePrefs.primaryModuleTabs.length >= MAX_PRIMARY_TABS
        ? modulePrefs.primaryModuleTabs
        : [...modulePrefs.primaryModuleTabs, moduleId];

    return (
      <ModuleDisabledPage
        moduleId={moduleId}
        onEnable={() =>
          saveSettings({
            ...settings,
            enabledModules: nextEnabledModules,
            primaryModuleTabs: nextPrimaryTabs,
            navigationFocus: deriveNavigationFocusFromModules(nextEnabledModules)
          })
        }
      />
    );
  }

  return element;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <div className="panel p-5 text-sm font-black uppercase tracking-[0.08em] text-petrol-800">Chargement...</div>
        </div>
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<ModuleRoute moduleId={route.moduleId} element={route.element} />} />
        ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
