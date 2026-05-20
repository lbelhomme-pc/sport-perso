import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTarget() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      window.setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target instanceof HTMLDetailsElement) {
          target.open = true;
        }
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
