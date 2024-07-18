// getBackgroundColor.js
export const getBackgroundColor = (title) => {
  switch (title) {
    case "Vehicles":
      return "#9fbf95";
    case "Charging Infrastructure":
      return "#9fbf95";
    case "Totals":
      return "#9fbf95";
    case "Loan Information":
      return "#9fbf95";
    default:
      return "";
  }
};

export const getTextColor = (title, value) => {
  let textColor = "black";
  if (value === "-") {
    return "black";
  }
  if (
    title === "Total Annual O&M Savings" ||
    title === "Total Annual Costs" ||
    title === "Annual Marginal Costs of Electrification" ||
    title === "Cumulative Marginal Costs of Electrification"
  ) {
    if (value && (value[0] === "-" || value < 0)) {
      textColor = "red";
    } else {
      textColor = "green";
    }
  }
  return textColor;
};

export const tooltipMap = {
  "Total Electric Vehicles in Fleet":
    "Total number of electric vehicles in the fleet",
  "Total Charging Infrastructure Savings":
    "Savings from charging management and charger incentives, rebates, or credits",
  "Cost of Electric Vehicles": "Estimated MSRP ($) not including incentives.",
  "Estimated EV Maintenance Costs":
    "Lifetime operations and maintenance costs for all electrified vehicles up to this year.",
  "ZEV Costs":
    "Total annual costs of ownership for zero-emission vehicles, including purchasing, operations, and maintenance.",
  "Electric Vehicle Charging Costs":
    "Costs of charging per kWh for all electrified vehicles up to this year.",
  "Default Vehicle Replacement Fund Allocation":
    "Estimated MSRP of the existing fleet vehicle",
  "Existing Vehicle Maintenance Costs":
    "Lifetime operations and maintenance costs for all non-electrified vehicles up to this year.",
  "Total Annual Costs":
    "Combines vehicle and charger annual costs of ownership.",
  "Cumulative Marginal Costs of Electrification":
    "Cumulative marginal costs of electrification, accounting for all factors.",
  "Annual Marginal Costs of Electrification":
    "Total marginal costs of electrification, accounting for all factors",
  "Default Replacement Costs":
    "Total annual costs of ownership for fleet vehicles, if replaced with default options.",
  "Total Vehicle Savings": "Annual fueling and O&M savings",
  "Total Charging Infrastructure Costs":
    "Costs of purchasing, installing, and other support for charging infrastructure.",
  "Total Annual O&M Savings":
    "Combines default replacement costs and infrastructure savings",
};
