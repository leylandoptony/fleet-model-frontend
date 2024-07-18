import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import { getFleetData, generateVehicleCandidates } from "../utils/vehicleMatch";
import supabase from "../supabaseClient";

const useProForma = create((set, get) => ({
  // Define your state properties here
  fleetData: [],
  replacementOptionsMap: {},
  controls: {},
  advancedControls: {},
  yearOverYear: {},
  phases: [],
  years: {},
  proFormaCalcs: {},
  allSitesProFormaCalcs: {},
  allSitesYearOverYear: {},
  cityInfo: {},

  // Define your state update functions here
  updateFleet: async (event, value) => {
    const equipment_id = event.data.equipment_id;
    const field = event.colDef.field;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/fleet/patch`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [field]: value,
            equipment_id: equipment_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      const result = await response.json();
      get().fetchAndUpdateFleet("fleetData");
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
    }
  },

  fetchAndUpdateFleet: async (field) => {

    const { user } = useAuthStore.getState();
    if (!user) {
      return;
    }
    try {

      const data = await getFleetData(user.id,field);
      set({
        fleetData: data.fleetData,
        replacementOptionsMap: data.replacementOptionsMap,
        yearOverYear: data.yearOverYear,
        phases: data.phases,
        controls: data.controls,
        advancedControls: data.advancedControls,
        years: data.years,
        proFormaCalcs: data.proFormaCalcs,
        allSitesProFormaCalcs: data.allSitesProFormaCalcs,
        allSitesYearOverYear: data.allSitesYearOverYear,
        chargerCost: data.chargerCost,
        cityInfo: data.cityInfo,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  resetFleet: () => {
    set({
      fleetData: [],
      replacementOptionsMap: {},
      yearOverYear: {},
      phases: [],
      controls: {},
      advancedControls: {},
      years: {},
      proFormaCalcs: {},
      allSitesProFormaCalcs: {},
      allSitesYearOverYear: {},
      cityInfo: {},
    });
  },
}));

export default useProForma;
