import { create } from "zustand";

const usePhases = create((set, get) => ({
  phases: [],
  filteredPhases: [],
  updatePhase: async (updatedPhase) => {
    set((state) => ({
      phases: state.phases.map((phase) =>
        phase.id === updatedPhase.id ? { ...phase, ...updatedPhase } : phase
      ),
    }));
  },
  addPhase: async (phase) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/phases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(phase),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add phase");
      }
      const newPhase = await response.json();
      set((state) => ({ phases: [...state.phases, newPhase] }));
    } catch (error) {
      console.error(error);
    }
  },
  removePhase: (phaseId) => {
    set((state) => ({
      phases: state.phases.filter((phase) => phase.id !== phaseId),
    }));
  },
  editPhase: (newPhase) => {
    set((state) => ({
      phases: state.phases.map((phase) =>
        phase.id === newPhase.id ? { ...phase, ...newPhase } : phase
      ),
    }));
  },
}));

export default usePhases;
