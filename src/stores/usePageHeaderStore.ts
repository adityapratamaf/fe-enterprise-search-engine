import { create } from "zustand";

type PageHeaderState = {
  title: string;
  badge?: string;
  setHeader: (title: string, badge?: string) => void;
};

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  title: "SPBU Search",
  badge: undefined,
  setHeader: (title, badge) => set({ title, badge }),
}));
