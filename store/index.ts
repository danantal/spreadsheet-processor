import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StoreState {
  files: File[];
  addFiles: (files: File[]) => void;
  clearFiles: () => void;
}

export const useStore = create<StoreState>()(
  devtools((set) => ({
    files: [],
    addFiles: (files) =>
      set((state) => ({ files: [...state.files, ...files] })),
    clearFiles: () =>
      set(() => ({
        files: [],
      })),
  }))
);
