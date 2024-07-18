export const proFormaCalcs = (advancedControls, controls, fleetData, years) => {
  let proFormaCalcs = {};
  const inflationRate = advancedControls.inflation
    ? 1 + advancedControls.inflation_escalation_rate / 100
    : 1;
  const electricityInflation =
    1 + advancedControls.electricity_escalation_rate / 100;
  const gasolineInflation = 1 + advancedControls.gasoline_escalation_rate / 100;
  const calculateYearSums = (field) => {
    return years.YEARS.reduce((acc, year) => {
      const yearTotal = fleetData
        .filter((item) => item["Replacement Year"] === year)
        .filter((item) => {
          return item.electrification_scenario[
            controls["electrification_scenario"]
          ];
        })
        .filter((item) => {
          return (
            item["Simplified Domicile"] === controls["site"] ||
            controls["site"] === "All Sites"
          );
        })
        .reduce((sum, item) => {
          const value = item[field];
          return sum + value;
        }, 0);
      let res = yearTotal;
      if (
        field === "EV Purchase Cost pre-incentive" ||
        field === "Default Replacement Allocation"
      ) {
        res *= Math.pow(inflationRate, year - years.CURRENT_YEAR);
      }
      acc[year] = res;
      return acc;
    }, {});
  };

  const countVehicles = () => {
    let yearCount = 0;
    return years.YEARS.reduce((acc, year) => {
      const yearTotal = fleetData
        .filter((item) => item["Replacement Year"] === year)
        .filter((item) => {
          return item.electrification_scenario[
            controls["electrification_scenario"]
          ];
        })
        .filter((item) => {
          return (
            item["Simplified Domicile"] === controls["site"] ||
            controls["site"] === "All Sites"
          );
        })
        .reduce((sum, item) => sum + 1, 0);
      yearCount += yearTotal;
      acc[year] = yearCount;
      return acc;
    }, {});
  };
  const countVehiclesBySite = () => {
    let siteCounts = 0;
    fleetData.forEach((item) => {
      const site = item["Simplified Domicile"];
      if (site === controls["site"] || controls["site"] === "All Sites") {
        siteCounts++;
      }
    });
    return siteCounts;
  };
  const countGHGTotals = () => {
    let siteCounts = 0;
    fleetData.forEach((item) => {
      const site = item["Simplified Domicile"];
      if (site === controls["site"] || controls["site"] === "All Sites") {
        siteCounts += item["ghg"];
      }
    });
    return siteCounts;
  };

  const calculateYearSumsWithinRange = (field) => {
    return years.YEARS.reduce((acc, year) => {
      const yearTotal = fleetData
        .filter(
          (item) =>
            item["Replacement Year"] <= year && (item["Expected Lifetime"]+item["Replacement Year"]) > year
        )
        .filter((item) => {
          return (
            item["Simplified Domicile"] === controls["site"] ||
            controls["site"] === "All Sites"
          );
        })
        .filter((item) => {
          return item.electrification_scenario[
            controls["electrification_scenario"]
          ];
        })
        .reduce((sum, item) => {
          const value = item[field];
          return sum + value;
        }, 0);
      let res = yearTotal;

      if (
        field === "EV Annual Maintenance Costs" ||
        field === "Existing Vehicle Annual Maintenance"
      ) {
        res *= Math.pow(inflationRate, year - years.CURRENT_YEAR);
      }
      if (field === "EV Annual Charging Costs") {
        res *= Math.pow(electricityInflation, year - years.CURRENT_YEAR);
      }
      if (field === "Existing Vehicle Annual Fuel Costs") {
        res *= Math.pow(gasolineInflation, year - years.CURRENT_YEAR);
      }
      acc[year] = res;
      return acc;
    }, {});
  };
  const calculateYearSumsGreaterThan = (field) => {
    return years.YEARS.reduce((acc, year) => {
      const yearTotal = fleetData
        .filter((item) => item["Replacement Year"] <= year)
        .filter((item) => {
          return item.electrification_scenario[
            controls["electrification_scenario"]
          ];
        })
        .filter((item) => {
          return (
            item["Simplified Domicile"] === controls["site"] ||
            controls["site"] === "All Sites"
          );
        })
        .reduce((sum, item) => {
          const value = parseFloat(item[field] || 0);
          return sum + value;
        }, 0);
      acc[year] = yearTotal;
      return acc;
    }, {});
  };
  const evPurchaseCostSums = calculateYearSums(
    "EV Purchase Cost pre-incentive"
  );
  const defaultReplacementAllocationSums = calculateYearSums(
    "Default Replacement Allocation"
  );
  const EVAnnualMaintenanceCost = calculateYearSumsWithinRange(
    "EV Annual Maintenance Costs"
  );
  const existingVehicleAnnualMaintenanceCost = calculateYearSumsWithinRange(
    "Existing Vehicle Annual Maintenance"
  );

  const EVAnnualChargingCosts = calculateYearSumsWithinRange(
    "EV Annual Charging Costs"
  );
  const existingVehicleAnnualFuelCosts = calculateYearSumsWithinRange(
    "Existing Vehicle Annual Fuel Costs"
  );

  const HVIP = calculateYearSums(
    "state_incentives"
  );
  const IRA = calculateYearSums("IRA Incentives");
  const vehicleCounts = countVehicles();

  const annualkwh = calculateYearSumsGreaterThan("Annual KWh");
  const ghgReductions = calculateYearSumsGreaterThan("ghg");
  const ghgTotals = countGHGTotals();
  const subtractedReductions = Object.keys(ghgReductions).reduce(
    (acc, year) => {
      acc[year] = ghgTotals - ghgReductions[year];
      return acc;
    },
    {}
  );

  const totalVehicles = countVehiclesBySite();

  proFormaCalcs = {
    evPurchaseCostSums,
    defaultReplacementAllocationSums,
    EVAnnualMaintenanceCost,
    existingVehicleAnnualMaintenanceCost,
    EVAnnualChargingCosts,
    existingVehicleAnnualFuelCosts,
    HVIP,
    IRA,
    vehicleCounts,
    totalVehicles,
    annualkwh,
    ghgReductions,
    subtractedReductions,
  };
  return proFormaCalcs;
};
export const calcYears = (fleetData, phases) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const END_YEAR = 2050;

  // Extract data and phases from the fleetData argument

  const minPhaseYear = Math.min(...phases.map((phase) => phase.year));
  const minReplacementYear = Math.min(
    ...fleetData.map((item) => item["Replacement Year"])
  );
  const START_YEAR = Math.min(minPhaseYear, minReplacementYear);

  const YEARS = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    YEARS.push(year);
  }

  return { YEARS, START_YEAR, END_YEAR, CURRENT_YEAR };
};
