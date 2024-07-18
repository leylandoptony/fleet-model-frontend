export const yearOverYear = (
  fleetData,
  proFormaCalcs,
  controls,
  advancedCalcs,
  years,
  phase
) => {
  const initialState = {
    estimatedElectricVehicles: {},
    costOfElectricVehicles: {},
    defaultVehicleReplacementFundAllocation: {},
    estimatedEVMaintenanceCosts: {},
    electricVehicleChargingCosts: {},
    existingVehicleMaintenanceCosts: {},
    existingVehicleAnnualFuelCost: {},
    numberOfNewPorts: {},
    newPortsByType: {},
    totalVehicleSavings: {},
    loanAmount: {},
    capitalPlanningFunding: {},
    loanPrincipalRemaining: {},
    loanAnnualInterest: {},
    loanAnnualPayments: {},
    chargerPurchaseCosts: {},
    chargerInstallCosts: {},
    trenchingCosts: {},
    upgradeCostUtility: {},
    upgradeCostCustomer: {},
    procurementManagementCost: {},
    estimatedPublicWorksEngineeringCosts: {},
    chargerMaintenanceCosts: {},
    chargerNetworkAndManagementCosts: {},
    chargeMangementSavings: {},
    chargerIncentives: {},
    zevCosts: {},
    defaultReplacementCosts: {},
    totalChargingInfrastructureCosts: {},
    totalChargingInfrastructureSavings: {},
    totalInfrastructureCostPreLoan: {},
    totalCosts: {},
    totalSavings: {},
    annualCostBenefit: {},
    cumulativeCostBenefit: {},
    netPresentValue: 0,
    totalCapitalCosts: {},
  };

  const set = (key, value) => {
    initialState[key] = value;
  };

  const {
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
  } = proFormaCalcs;
  const updateInitialState = (newValues) => {
    Object.assign(initialState, newValues);
  };

  const { YEARS, CURRENT_YEAR, START_YEAR, END_YEAR } = years;
  const { phases, filteredPhases } = phase;
  const min = Math.min(...filteredPhases.map((phase) => phase.year));

  //SET THE COST OF ELECTRIC VEHICLES
  const costOfElectricVehicles = YEARS.reduce((acc, year) => {
    acc[year] = evPurchaseCostSums[year] || 0;
    if (controls.incentives) {
      acc[year] -= HVIP[year] || 0;
    }
    if (controls.ira_incentives) {
      acc[year] -= IRA[year] || 0;
    }

    return acc;
  }, {});
  set("costOfElectricVehicles", costOfElectricVehicles);

  //default replacement fund
  const defaultVehicleReplacementFundAllocation = YEARS.reduce((acc, year) => {
    acc[year] = defaultReplacementAllocationSums[year];
    return acc;
  }, {});
  set(
    "defaultVehicleReplacementFundAllocation",
    defaultVehicleReplacementFundAllocation
  );

  //estimated EV maintenance costs
  const estimatedEVMaintenanceCosts = YEARS.reduce((acc, year) => {
    if (year >= min) {
      acc[year] = EVAnnualMaintenanceCost[year];
    } else {
      acc[year] = 0;
    }

    return acc;
  }, {});
  set("estimatedEVMaintenanceCosts", estimatedEVMaintenanceCosts);

  //set ev charging costs
  const electricVehicleChargingCosts = YEARS.reduce((acc, year) => {
    if (year >= min) {
      acc[year] = EVAnnualChargingCosts[year];
    } else {
      acc[year] = 0;
    }

    return acc;
  }, {});
  set("electricVehicleChargingCosts", electricVehicleChargingCosts);

  //set existing vehicle maintenance costs
  const existingVehicleMaintenanceCosts = YEARS.reduce((acc, year) => {
    if (year >= min) {
      acc[year] = existingVehicleAnnualMaintenanceCost[year];
    } else {
      acc[year] = 0;
    }

    return acc;
  }, {});
  set("existingVehicleMaintenanceCosts", existingVehicleMaintenanceCosts);

  //set existing vehicle annual fuel costs
  const fuelCost = YEARS.reduce((acc, year) => {
    if (year >= min) {
      acc[year] = existingVehicleAnnualFuelCosts[year];
    } else {
      acc[year] = 0;
    }
    return acc;
  }, {});
  set("existingVehicleAnnualFuelCost", fuelCost);

  //set estimated electric vehicles
  const estimatedElectricVehicles = YEARS.reduce((acc, year) => {
    acc[year] = vehicleCounts[year];
    return acc;
  }, {});
  set("estimatedElectricVehicles", estimatedElectricVehicles);

  //set number of new ports
  const numberOfNewPorts = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    filteredPhases
      .filter((phase) => phase.year === year)
      .forEach((phase) => {
        acc[year] +=
          phase.port_less_than_10_kw +
          phase.port_10_20_kw +
          phase.port_25_kw +
          phase.port_180_200_kw;
      });

    return acc;
  }, {});
  set("numberOfNewPorts", numberOfNewPorts);

  const newPortsByType = YEARS.reduce((acc, year) => {
    acc[year] = {
      port_less_than_10_kw: 0,
      port_10_20_kw: 0,
      port_25_kw: 0,
      port_180_200_kw: 0
    };
    filteredPhases
      .filter((phase) => phase.year === year)
      .forEach((phase) => {
        acc[year].port_less_than_10_kw += phase.port_less_than_10_kw;
        acc[year].port_10_20_kw += phase.port_10_20_kw;
        acc[year].port_25_kw += phase.port_25_kw;
        acc[year].port_180_200_kw += phase.port_180_200_kw;
      });

    return acc;
  }, {});
  set("newPortsByType", newPortsByType);

  //set loan amount
  const loanAmount = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    filteredPhases
      .filter((phase) => phase.year === year)
      .forEach((phase) => {
        acc[year] += phase.loan_amount;
      });

    return acc;
  }, {});
  set("loanAmount", loanAmount);

  //set charger purchase amount
  const chargerPurchaseCosts = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    filteredPhases
      .filter((phase) => phase.year === year)
      .forEach((phase) => {
        acc[year] += phase.cost;
      });

    return acc;
  }, {});
  set("chargerPurchaseCosts", chargerPurchaseCosts);

  //set charger install amount
  const chargerInstallCosts = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    filteredPhases
      .filter((phase) => phase.year === year)
      .forEach((phase) => {
        acc[year] += phase.installCost;
      });

    return acc;
  }, {});

  const sumCostsByYear = (accessor) => {
    const costs = YEARS.reduce((acc, year) => {
      acc[year] = 0;
      filteredPhases
        .filter((phase) => phase.year === year)
        .forEach((phase) => {
          acc[year] += phase[accessor];
        });

      return acc;
    }, {});
    return costs;
  };

  //set infrastructure costs
  set("chargerInstallCosts", chargerInstallCosts);
  const trenchingCosts = sumCostsByYear("trenching_costs");
  const upgradeCostUtility = sumCostsByYear("upgrade_cost_utility");
  const upgradeCostCustomer = sumCostsByYear("upgrade_cost_customer");
  const procurementManagementCost = sumCostsByYear(
    "procurement_management_cost"
  );

  const estimatedPublicWorksEngineeringCosts = sumCostsByYear(
    "estimated_public_works_engineering_costs"
  );

  const chargerIncentives = sumCostsByYear("incentives");

  const capitalPlanningFunding = sumCostsByYear("capital_planning_funding");

  updateInitialState({
    trenchingCosts,
    upgradeCostUtility,
    upgradeCostCustomer,
    procurementManagementCost,
    estimatedPublicWorksEngineeringCosts,
    chargerIncentives,
    capitalPlanningFunding,
  });

  //set loan principal remaining
  let curYear = START_YEAR;
  let loanPrincipalRemaining = {};
  let loanAnnualInterest = {};
  let loanAnnualPayments = {};
  let curLoanAmount = 0;
  loanPrincipalRemaining[curYear - 1] = 0;
  loanAnnualInterest[curYear - 1] = 0;
  loanAnnualPayments[curYear - 1] = 0;
  while (curYear <= END_YEAR) {
    curLoanAmount += loanAmount[curYear];
    if (loanAmount[curYear - advancedCalcs.infrastructure_loan_term]) {
      curLoanAmount -=
        loanAmount[curYear - advancedCalcs.infrastructure_loan_term];
    }
    loanPrincipalRemaining[curYear] =
      loanAmount[curYear] +
      loanPrincipalRemaining[curYear - 1] +
      loanAnnualInterest[curYear - 1] -
      loanAnnualPayments[curYear - 1];
    loanAnnualInterest[curYear] =
      loanPrincipalRemaining[curYear] *
      (advancedCalcs.infrastructure_loan_interest_rate / 100);
    loanAnnualPayments[curYear] =
      curLoanAmount / advancedCalcs.infrastructure_loan_term +
      loanAnnualInterest[curYear];
    curYear++;
  }
  updateInitialState({
    loanPrincipalRemaining,
    loanAnnualInterest,
    loanAnnualPayments,
  });

  let costs = 0;
  const chargerMaintenanceCosts = YEARS.reduce((acc, year) => {
    costs +=
      (initialState.numberOfNewPorts[year] / 2) *
      advancedCalcs.maintenance_costs_annual_per_station;
    acc[year] = costs;
    return acc;
  }, {});
  updateInitialState({ chargerMaintenanceCosts });

  costs = 0;
  const chargerNetworkAndManagementCosts = YEARS.reduce((acc, year) => {
    costs +=
      (initialState.numberOfNewPorts[year] / 2) *
      (advancedCalcs.charger_network_costs +
        advancedCalcs.charge_management_subscription_costs);
    acc[year] = costs;
    return acc;
  }, {});
  updateInitialState({ chargerNetworkAndManagementCosts });

  const chargeMangementSavings = YEARS.reduce((acc, year) => {
    if (advancedCalcs.charging_optimization) {
      acc[year] =
        vehicleCounts[year] * advancedCalcs.charging_optimization_savings;
    } else {
      acc[year] = 0;
    }

    return acc;
  }, {});
  updateInitialState({ chargeMangementSavings });

  const zevCosts = YEARS.reduce((acc, year) => {
    acc[year] =
      costOfElectricVehicles[year] +
      estimatedEVMaintenanceCosts[year] +
      electricVehicleChargingCosts[year];
    return acc;
  }, {});

  updateInitialState({ zevCosts });

  const defaultReplacementCosts = YEARS.reduce((acc, year) => {
    acc[year] =
      defaultVehicleReplacementFundAllocation[year] +
      existingVehicleMaintenanceCosts[year] +
      fuelCost[year];

    return acc;
  }, {});
  updateInitialState({ defaultReplacementCosts });

  const totalVehicleSavings = YEARS.reduce((acc, year) => {
    acc[year] =
      fuelCost[year] -
      estimatedEVMaintenanceCosts[year] -
      electricVehicleChargingCosts[year] +
      existingVehicleMaintenanceCosts[year];
    return acc;
  }, {});
  updateInitialState({ totalVehicleSavings });

  const totalChargingInfrastructureCosts = YEARS.reduce((acc, year) => {
    acc[year] =
      loanAnnualPayments[year] +
      chargerMaintenanceCosts[year] +
      chargerNetworkAndManagementCosts[year] +
      chargerPurchaseCosts[year] +
      chargerInstallCosts[year] +
      trenchingCosts[year] +
      upgradeCostUtility[year] +
      upgradeCostCustomer[year] +
      estimatedPublicWorksEngineeringCosts[year] +
      procurementManagementCost[year] -
      loanAmount[year] -
      capitalPlanningFunding[year];

    return acc;
  }, {});
  updateInitialState({ totalChargingInfrastructureCosts });

  const totalInfrastructureCostPreLoan = YEARS.reduce((acc, year) => {
    acc[year] =
      totalChargingInfrastructureCosts[year] +
      loanAmount[year] +
      capitalPlanningFunding[year];

    return acc;
  }, {});
  updateInitialState({ totalInfrastructureCostPreLoan });

  const totalChargingInfrastructureSavings = YEARS.reduce((acc, year) => {
    acc[year] = chargeMangementSavings[year] + chargerIncentives[year];
    return acc;
  }, {});
  updateInitialState({ totalChargingInfrastructureSavings });

  const totalCosts = YEARS.reduce((acc, year) => {
    acc[year] = zevCosts[year] + totalChargingInfrastructureCosts[year];
    return acc;
  }, {});
  updateInitialState({ totalCosts });

  const totalSavings = YEARS.reduce((acc, year) => {
    acc[year] =
      defaultReplacementCosts[year] + totalChargingInfrastructureSavings[year];
    return acc;
  }, {});
  updateInitialState({ totalSavings });

  const annualCostBenefit = YEARS.reduce((acc, year) => {
    acc[year] = totalSavings[year] - totalCosts[year];
    return acc;
  }, {});
  updateInitialState({ annualCostBenefit });

  const cumulativeCostBenefit = YEARS.reduce((acc, year) => {
    acc[year] = annualCostBenefit[year] + (acc[year - 1] || 0);
    return acc;
  }, {});
  updateInitialState({ cumulativeCostBenefit });

  const netPresentValue = YEARS.reduce((acc, year) => {
    acc +=
      annualCostBenefit[year] /
      Math.pow(1 + advancedCalcs.discount_rate_npv / 100, year - START_YEAR);
    return acc;
  }, 0);
  updateInitialState({ netPresentValue });

  const totalCapitalCosts = YEARS.reduce((acc, year) => {
    acc[year] =
      costOfElectricVehicles[year] +
      chargerPurchaseCosts[year] +
      chargerInstallCosts[year] +
      trenchingCosts[year] +
      upgradeCostUtility[year] +
      upgradeCostCustomer[year] +
      procurementManagementCost[year] +
      estimatedPublicWorksEngineeringCosts[year];
    return acc;
  }, {});
  updateInitialState({ totalCapitalCosts });

  return initialState;
};
