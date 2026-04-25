import { resetSessionChecklist, saveSessionChecklist, toggleSessionChecklistItem } from "../services/storageService";
import { useStoredData } from "./useStoredData";

export function useSessionChecklists() {
  const data = useStoredData();

  return {
    sessionChecklists: data.sessionChecklists,
    getCheckedItemIds: (plannedSessionId: string) =>
      data.sessionChecklists.find((item) => item.plannedSessionId === plannedSessionId)?.checkedItemIds ?? [],
    saveChecklist: saveSessionChecklist,
    toggleChecklistItem: toggleSessionChecklistItem,
    resetChecklist: resetSessionChecklist
  };
}

