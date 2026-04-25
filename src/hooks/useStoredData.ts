import { useEffect, useState } from "react";
import type { AppData } from "../types";
import { loadData, subscribeToStorage } from "../services/storageService";

export function useStoredData(): AppData {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    return subscribeToStorage(() => {
      setData(loadData());
    });
  }, []);

  return data;
}
