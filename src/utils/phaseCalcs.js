export const calculatePhases = (phases, chargerCosts, controls) => {
  let res = {};
  const phaseCosts = phases.map((phase, index) => {
    const cost =
      //round these calculations
      divideByTwo(phase.port_less_than_10_kw) *
        chargerCosts["cost_less_than_10_kw"] +
      divideByTwo(phase.port_10_20_kw) * chargerCosts["cost_10_20_kw"] +
      divideByTwo(phase.port_25_kw) * chargerCosts["cost_25_kw"] +
      divideByTwo(phase.port_180_200_kw) * chargerCosts["cost_180_200_kw"];
    let installCost = 0;
    installCost =
      divideByTwo(phase.port_less_than_10_kw) *
        chargerCosts["install_less_than_10_kw"] +
      divideByTwo(phase.port_10_20_kw) * chargerCosts["install_10_20_kw"] +
      divideByTwo(phase.port_25_kw) * chargerCosts["install_25_kw"] +
      divideByTwo(phase.port_180_200_kw) * chargerCosts["install_180_200_kw"];
    return {
      ...phase,
      cost,
      installCost,
    };
  });
  const sortedPhases = phaseCosts.sort((a, b) => a.id - b.id);

  if (controls) {
    const filteredPhases = sortedPhases.filter(
      (phase) =>
        phase.site === controls.site || controls.site === "All Sites"
    );
    res.filteredPhases = filteredPhases;
  }
  res.phases = sortedPhases;

  return res;
};

const divideByTwo = (num) => Math.ceil(num / 2);
