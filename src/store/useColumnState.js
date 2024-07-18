import {create} from 'zustand';

const useColumnState = create((set) => ({
    fleet: {},
    setFleetState: (fleet) => set({ fleet }),
    phaseColumns: {},
    setPhaseColumns: (phaseColumns) => set({ phaseColumns }),
    yearColumns: {},
    setYearColumns: (yearColumns) => set({ yearColumns }),
}));

export default useColumnState;