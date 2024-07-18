// src/CapitalCostsGraph.js
import React, { useEffect,useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useProForma from "../../store/useProForma";
import {axisHelper} from "../../utils/graphs/axisHelper"
import useCache from "../../store/useCache";

const roundedValue = (value, up = true) => {
  return up ? Math.ceil((value * 1.2) / 100000) * 100000 : Math.floor((value * 1.2) / 100000) * 100000;
}

const transformData = (totalCosts) => {
  const data = [];

  Object.keys(totalCosts).forEach((year) => {
    data.push({
      year: parseInt(year, 10),
      totalCosts: totalCosts[year],
    });
  });

  return data;
};

const formatAsCurrency = (value) => {
  const roundedValue = Math.round(value);
  const absValue = Math.abs(roundedValue)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return roundedValue < 0 ? `-$${absValue}` : `$${absValue}`;
};

const CapitalCostsGraph = () => {
  const {yearOverYear,controls,allSitesYearOverYear,cityInfo}= useProForma();
  const { costOfElectricVehicles:yearOverYearTotalCapitalCosts={} } = allSitesYearOverYear;
  const { costOfElectricVehicles={} } = yearOverYear;
  const data = transformData(costOfElectricVehicles);
  const data2 = transformData(yearOverYearTotalCapitalCosts);
  //state variables
  const [maxVal,setMaxVal] = useState(0);

  useEffect(() => {
    let max=0;
    Object.values(yearOverYearTotalCapitalCosts).forEach((value) => {
      if (value > max) {
        max = value;
      }
    }) 
    let maxRounded = roundedValue(max);


    setMaxVal(Math.max(maxRounded,cityInfo.capital_costs_max));

  }, [allSitesYearOverYear]);


  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Costs</CardTitle>
        <CardDescription>{controls && controls.site}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer className="" width="100%" height={200}>
          <LineChart data={data} margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis minTickGap={-10} type="number" domain= {[0,maxVal]} ticks={axisHelper(0,maxVal,4)} tickFormatter={formatAsCurrency}>
              <Label
                value="Total Costs ($)"
                angle={-90}
                position="insideLeft"
                offset={-40}
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip formatter={formatAsCurrency} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalCosts"
              stroke="#6a7b9e"
              name="Selected Site Total Costs ($)"
            />
            <Line
              type="monotone"
              dataKey="totalCosts"
              stroke="#82ca9d"
              name="All Sites Total Costs ($)"
              data={data2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CapitalCostsGraph;
