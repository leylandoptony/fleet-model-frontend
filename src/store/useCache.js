import {create} from 'zustand';
import useProForma from './useProForma';
import {patchCityInfo} from '../api/cityInfo';

const useCache = create((set,get) => ({
  fleetData: [],
  advancedControls: null,
  controls: { data: null },
  phases: [],
  chargerCost: null,
  cityInfo: null,
  setFleetData: (data) => set({ fleetData: data }),
  setAdvancedControls: (data) => set({ advancedControls: data }),
  setControls: (data) => set({ controls: { data } }),
  setPhases: (data) => set({ phases: data }),
  setChargerCost: (data) => set({ chargerCost: data }),
  setCityInfo: (data) => set({ cityInfo: data }),

  updateControls: (attribute, value) => {
    const { fetchAndUpdateFleet } = useProForma.getState();
    set((state) => {
      const updatedControls = [...state.controls.data];
      if (updatedControls.length > 0) {
        updatedControls[0] = {
          ...updatedControls[0],
          [attribute]: value,
        };
      }
      return { controls: { data: updatedControls } };
    });
    fetchAndUpdateFleet("none");
  },
  updateAdvancedControls: (updates) => {
    const { fetchAndUpdateFleet } = useProForma.getState();
    set((state) => {
      const updatedControls = [...state.advancedControls.data];
      if (updatedControls.length > 0) {
        updatedControls[0] = {
          ...updatedControls[0],
          ...updates
        };
      }
      return { advancedControls: { data: updatedControls } };
    });
    fetchAndUpdateFleet("none");
  },
  updateCityInfo: (attribute, value) => {
    const { fetchAndUpdateFleet } = useProForma.getState();
    patchCityInfo({ [attribute]: value });
    set((state) => {
      const updatedCityInfo = [...state.cityInfo.data];
      if (updatedCityInfo.length > 0) {
        updatedCityInfo[0] = {
          ...updatedCityInfo[0],
          [attribute]: value,
        };
      }
      return { cityInfo: { data: updatedCityInfo } };
    });
    fetchAndUpdateFleet("none");
  },
}));

export default useCache;