import { create } from "zustand";

const useAdvancedCalc = create((set, get) => ({
  advancedCalcs: null,
  setAdvancedCalcs: (advancedCalcs) => {
    set({ advancedCalcs });
  },
}));

export default useAdvancedCalc;
