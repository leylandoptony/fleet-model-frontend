// src/ComparisonBarChart.js
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useProForma from "../../store/useProForma";
import useCache from "../../store/useCache";
import {axisHelper} from "../../utils/graphs/axisHelper"

function formatAsCurrency(value) {
  const roundedValue = Math.round(value);
  return `$${roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

const roundedValue = (value) => {
  return Math.ceil((value*1.2)/100000)*100000;
}

const TotalCostsGraph = () => {
  const {yearOverYear,controls,cityInfo} = useProForma();
  const { totalCosts={}, totalSavings={} } = yearOverYear;
  const [totalCost, setTotalCost] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [ticks,setTicks] = useState([]);

  const sumValues = (data) => {
    let sum = 0;
    for (const year in data) {
      if (year === "title") {
        continue;
      }
      sum += data[year];
    }
    return sum;
  };

  useEffect(() => {
    const totalCostSum = sumValues(totalCosts);
    const totalSavingsSum = sumValues(totalSavings);
    setTotalCost(totalCostSum);
    setTotalSaving(totalSavingsSum);

    let maxCostSaving = Math.max(roundedValue(totalCostSum), roundedValue(totalSavingsSum),cityInfo.cost_savings_max);
    maxCostSaving = Math.round(maxCostSaving);
    setMaxValue(maxCostSaving);
    setTicks(axisHelper(0,maxCostSaving,5))

  }, [yearOverYear]);
  



  const data = [
    {
      name: "Cumulative Values",
      cost: parseInt(totalCost),
      savings: parseInt(totalSaving),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Total Costs
          <span className="text-xl text-gray-600">
            {" "}
            - {controls && controls.site}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart barGap={12} data={data} margin={{ left: 45 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={false} />
            <YAxis domain={[0, maxValue]} 
            ticks={ticks}  
            tickFormatter={formatAsCurrency} />
            {/* <Tooltip formatter={formatAsCurrency} /> */}
            <Legend />
            <Bar dataKey="cost" fill="#6a7b9e" name="ZEV & EVSE Costs">
              <LabelList
                dataKey="cost"
                position="top"
                formatter={formatAsCurrency}
              />
            </Bar>
            <Bar dataKey="savings" fill="#88a37f" name="Default Replacement Costs">
              <LabelList
                dataKey="savings"
                position="top"
                formatter={formatAsCurrency}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalCostsGraph;
