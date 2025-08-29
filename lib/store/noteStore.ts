import { create } from "zustand"; 
import { persist } from "zustand/middleware";

export type NoteDraft = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

type DraftState = {
  draft: NoteDraft;
  updateDraft: (next: NoteDraft) => void;
  resetDraft: () => void;
};

const defaultNote: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: defaultNote,
      updateDraft: (next) => set({ draft: next }),
      resetDraft: () => set({ draft: defaultNote }),
    }),
    {
      name: "draft-note-storage",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
