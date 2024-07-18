import { createClient } from "@supabase/supabase-js";
import { proFormaCalcs, calcYears } from "./proFormaCalcs";
import { yearOverYear } from "./yearOverYear";
import { calculatePhases } from "./phaseCalcs";
import supabase from "../supabaseClient";
import fetchData from "./fetchData";

export const getFleetData = async (userId,field) => {
  try {
    // Fetch data from both tables concurrently

    let fleetData, advancedControls, controls, phases, chargerCost, cityInfo;
    const data = await fetchData(userId,field);
    advancedControls = data.advancedControls;
    controls = data.controls;
    phases = data.phases;
    chargerCost = data.chargerCost;
    cityInfo = data.cityInfo;
    fleetData = data.fleetData;

    // Perform calculations on fleetData
    fleetData.forEach((vehicle) => {
      vehicle.id = String(vehicle.equipment_id);
    });
    fleetData.sort((a, b) => a.equipment_id - b.equipment_id);

    let result = {};
    result.cityInfo = cityInfo;
    
    
    result.fleetData = fleetData;
    

    const years = calcYears(result.fleetData, phases);
    let allSitesControls = { ...controls };
    allSitesControls.site = "All Sites";
    result.years = years;
    result.proFormaCalcs = proFormaCalcs(
      advancedControls,
      controls,
      result.fleetData,
      years
    );

    result.chargerCost = chargerCost;
    result.phases = calculatePhases(phases, chargerCost, controls);
    result.yearOverYear = yearOverYear(
      result.fleetData,
      result.proFormaCalcs,
      controls,
      advancedControls,
      years,
      result.phases
    );
    result.allSitesProFormaCalcs = proFormaCalcs(
      advancedControls,
      allSitesControls,
      result.fleetData,
      years
    );
    result.allSitesYearOverYear = yearOverYear(
      result.fleetData,
      result.allSitesProFormaCalcs,
      allSitesControls,
      advancedControls,
      years,
      result.phases
    );
    result.controls = setControlsData(controls, fleetData);
    result.advancedControls = advancedControls;
    // Send the result back to the client

    return result;
  } catch (error) {
    console.error("Error fetching data:",error)
  }
};

const setControlsData = (controls, fleetData) => {
  const uniqueDomiciles = [
    ...new Set(fleetData.map((item) => item["Simplified Domicile"])),
  ];
  controls.domiciles = uniqueDomiciles;
  return controls;
};
