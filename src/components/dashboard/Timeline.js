import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import useProForma from "../../store/useProForma";

function formatCurrency(value) {
  if (value === 0) {
    return "$-";
  }
  return `$${Math.abs(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

const defaultValues ={
  range_1: "<10 kW",
  range_2: "10-20 kW",
  range_3: "25 kW",
  range_4: "180-200 kW",
}


const formatNum = (value) => {
  if (value === 0) {
    return "-";
  }
  return value;
};

const Timeline = () => {
  const { proFormaCalcs, years, yearOverYear, controls, cityInfo } =
    useProForma();
  const { END_YEAR } = years;
  const { vehicleCounts, totalVehicles } = proFormaCalcs;
  const {
    newPortsByType,
    numberOfNewPorts,
    chargerIncentives,
    netPresentValue,
    totalCosts,
    chargerNetworkAndManagementCosts,
    chargerMaintenanceCosts,
  } = yearOverYear;

  const [vehiclesElectrified, setVehiclesElectrified] = useState("");
  const [totalCount, setTotalCount] = useState("");
  const [portSum, setPortSum] = useState("");
  const [ports, setPorts] = useState({});
  const [incentiveSum, setIncentiveSum] = useState("");
  const [capitalCosts, setCapitalCosts] = useState("");

  useEffect(() => {
    if (vehicleCounts) {
      setVehiclesElectrified(vehicleCounts[END_YEAR]);
    }
  }, [vehicleCounts]);
  useEffect(() => {
    if (totalVehicles) {
      setTotalCount(totalVehicles);
    }
  }, [totalVehicles]);

  const calculateSum = (values) => {
    return Object.values(values).reduce((acc, curr) => acc + curr, 0);
  };
  const calculateSumByType = (values, type) => {
    return Object.values(values).reduce((acc, curr) => acc + curr[type], 0);
  };

  useEffect(() => {
    if (numberOfNewPorts) {
      const sum = calculateSum(numberOfNewPorts);
      setPortSum(sum);
    }
  }, [numberOfNewPorts]);

  useEffect(() => {
    if (newPortsByType) {
      const portsByType = {};
      portsByType.range_1 = calculateSumByType(
        newPortsByType,
        "port_less_than_10_kw"
      );
      portsByType.range_2 = calculateSumByType(newPortsByType, "port_10_20_kw");
      portsByType.range_3 = calculateSumByType(newPortsByType, "port_25_kw");
      portsByType.range_4 = calculateSumByType(
        newPortsByType,
        "port_180_200_kw"
      );
      setPorts(portsByType);
    }
  }, [newPortsByType]);

  useEffect(() => {
    if (chargerIncentives) {
      const sum = calculateSum(chargerIncentives);
      setIncentiveSum(sum);
    }
  }, [chargerIncentives]);

  useEffect(() => {
    if (totalCosts) {
      const sum =
        calculateSum(totalCosts) -
        calculateSum(chargerNetworkAndManagementCosts) -
        calculateSum(chargerMaintenanceCosts);
      setCapitalCosts(sum);
    }
  }, [totalCosts]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>⏱ Electrification Timeline</CardTitle>
        <CardDescription>{controls && controls.site}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        <div className="flex w-full justify-center gap-2 items-center">
          <p className="flex-1 text-xl font-bold text-right">
            {formatNum(vehiclesElectrified)}/{totalVehicles}
          </p>
          <p className="flex-[2_2_0%] text-bold">vehicles electrified</p>
        </div>

        <div className="flex w-full justify-center gap-2 items-start">
          <p className="flex-1 text-xl font-bold text-right">
            {formatCurrency(incentiveSum)}
          </p>
          <p className="flex-[2_2_0%] text-bold">
            total charger incentive value
          </p>
        </div>
        <div className="flex w-full justify-center gap-2 items-start">
          <p className="flex-1  text-xl font-bold text-right">
            {formatCurrency(netPresentValue)}
          </p>
          <p className="flex-[2_2_0%] text-bold">Net Present Value</p>
        </div>
        <div className="flex w-full justify-center gap-2 items-start">
          <p className="flex-1  text-xl font-bold text-right">
            {formatCurrency(capitalCosts)}
          </p>
          <p className="flex-[2_2_0%] text-bold">Total Capital Costs</p>
        </div>
        <div className="flex w-full justify-center gap-2 items-start">
          <p className="flex-1  text-xl font-bold text-right">
            {formatNum(portSum)}
          </p>
          <p className="flex-[2_2_0%] text-bold">Total ports installed</p>
        </div>
        {Object.keys(ports).map((key) => (
          <div className="flex w-full justify-center gap-2 items-start">
            <p className="flex-1  text-xl font-bold text-right">
              {formatNum(ports[key])}
            </p>
            <p className="flex-[2_2_0%] text-bold">{"Ports "+(cityInfo[key]? cityInfo[key]:defaultValues[key])}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Timeline;
