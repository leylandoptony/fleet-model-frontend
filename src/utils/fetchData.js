import supabase from "../supabaseClient";
import useCache from "../store/useCache"; // Import Zustand store
import {fetchCityInfo} from "../api/cityInfo"; // Import fetchCityInfo function

const fetchData = async (userId, updateItem) => {
  const state = useCache.getState();

  const shouldFetchAll = !updateItem;
  const shouldFetchNone = updateItem === "none";

  const shouldFetch = (item) =>
    !shouldFetchNone && (shouldFetchAll || updateItem === item);

  const promises = {
    fleetData: shouldFetch("fleetData")
      ? supabase.from("fleet data").select("*").eq("user_id", userId)
      : Promise.resolve(state.fleetData),
    advancedControls: shouldFetch("advancedControls")
      ? supabase.from("advanced controls").select("*").eq("id", userId)
      : Promise.resolve(state.advancedControls),
    controls: shouldFetch("controls")
      ? supabase.from("controls").select("*").eq("id", userId)
      : Promise.resolve(state.controls),
    phases: shouldFetch("phases")
      ? supabase.from("phases").select("*").eq("user_id", userId)
      : Promise.resolve(state.phases),
    chargerCost: shouldFetch("chargerCost")
      ? supabase.from("charger costs").select("*").eq("id", userId)
      : Promise.resolve(state.chargerCost),
    cityInfo: shouldFetch("cityInfo")
      ? fetchCityInfo()
      : Promise.resolve(state.cityInfo),
  };

  const [
    fleetDataResponse,
    advancedControlsResponse,
    controlsResponse,
    phasesResponse,
    chargerCostResponse,
    cityInfoResponse,
  ] = await Promise.all(Object.values(promises));


  const errors = [
    { name: "fleetData", error: fleetDataResponse.error },
    { name: "advancedControls", error: advancedControlsResponse.error },
    { name: "controls", error: controlsResponse.error },
    { name: "phases", error: phasesResponse.error },
    { name: "chargerCost", error: chargerCostResponse.error },
    { name: "cityInfo", error: cityInfoResponse.error },
  ].filter(({ error }) => error);


  if (errors.length) {
    errors.forEach(({ name, error }) => {
      throw new Error(`Error fetching ${name}: ${error.message}`);
    });
  }

  if (shouldFetchAll || updateItem === "fleetData")
    useCache.setState({ fleetData: fleetDataResponse });
  if (shouldFetchAll || updateItem === "advancedControls")
    useCache.setState({ advancedControls: advancedControlsResponse });
  if (shouldFetchAll || updateItem === "controls")
    useCache.setState({ controls: controlsResponse });
  if (shouldFetchAll || updateItem === "phases")
    useCache.setState({ phases: phasesResponse });
  if (shouldFetchAll || updateItem === "chargerCost")
    useCache.setState({ chargerCost: chargerCostResponse });
  if (shouldFetchAll || updateItem === "cityInfo")
    useCache.setState({ cityInfo: cityInfoResponse });

  return {
    fleetData: fleetDataResponse.data,
    advancedControls: advancedControlsResponse.data[0],
    controls: controlsResponse.data[0],
    phases: phasesResponse.data,
    chargerCost: chargerCostResponse.data[0],
    cityInfo: cityInfoResponse.data[0],
  };
};

export default fetchData;
