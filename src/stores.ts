import { create } from "zustand";

export const useChartStore = create((set) => ({
  chartList: [],
  setChartList: (data) => set((state) => ({ chartList: data })),
}));
