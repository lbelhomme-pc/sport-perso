import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { appRoutes } from "./routes";

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
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
