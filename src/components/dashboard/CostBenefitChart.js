import React, { useEffect ,useState} from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  Bar,
  Cell,
  ComposedChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useProForma from "../../store/useProForma";
import useCache from "../../store/useCache";
import {axisHelper} from "../../utils/graphs/axisHelper"

const formatAsCurrency = (value) => {
  const roundedValue = Math.round(value); // Rounds to the nearest whole number
  const absValue = Math.abs(roundedValue)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return value < 0 ? `-$${absValue}` : `$${absValue}`;
};


const roundBoth = (min,max) => {
  const range = max - min
  const minRounded = Math.floor((min - range*0.1) / 100000) * 100000
  const maxRounded = Math.ceil((max + range*0.1) / 100000) * 100000
  return {minRounded,maxRounded}
}

const transformData = (annualCostBenefit, cumulativeCostBenefit) => {
  const data = [];

  Object.keys(annualCostBenefit).forEach((year) => {
    data.push({
      year: parseInt(year, 10),
      annualCostBenefit: parseInt(annualCostBenefit[year]),
      cumulativeCostBenefit: parseInt(cumulativeCostBenefit[year]),
    });
  });

  return data;
};

const CostBenefitChart = () => {
  const {yearOverYear,controls,cityInfo} = useProForma();
  const { annualCostBenefit={}, cumulativeCostBenefit={} } = yearOverYear;

  const [minVal,setMinVal] = useState(0);
  const [maxVal,setMaxVal] = useState(0);
  const data = transformData(annualCostBenefit, cumulativeCostBenefit);

  useEffect(() => {

  const annualCostBenefitValues = Object.values(
    annualCostBenefit
  ).map((value) => parseInt(value, 10));
  const cumulativeCostBenefitValues = Object.values(
    cumulativeCostBenefit
  ).map((value) => parseInt(value, 10));

  const minAnnualValue = Math.min(...annualCostBenefitValues);
  const maxAnnualValue = Math.max(...annualCostBenefitValues);

  const minCumulativeValue = Math.min(...cumulativeCostBenefitValues);
  const maxCumulativeValue = Math.max(...cumulativeCostBenefitValues);

  let minValue = Math.min(minAnnualValue, minCumulativeValue);
  let maxValue = Math.max(maxAnnualValue, maxCumulativeValue);

  const {minRounded,maxRounded} = roundBoth(minValue,maxValue)
  minValue=minRounded
  maxValue=maxRounded

  minValue =
    cityInfo && cityInfo.cost_benefit_min
      ? Math.min(cityInfo.cost_benefit_min,minValue)
      : minValue;
  maxValue =
    cityInfo && cityInfo.cost_benefit_max
      ? Math.max(cityInfo.cost_benefit_max,maxValue)
      : maxValue;

  setMinVal(minValue)
  setMaxVal(maxValue)
  }, [yearOverYear]);


  

  const getBarColor = (value) => (value >= 0 ? "#6a9e66" : "#e57373");

  const customLegendPayload = [
    { value: "Annual Cost Benefit ($)", type: "rect", color: "#6a9e66" },
    { value: "Annual Cost Benefit (-$)", type: "rect", color: "#e57373" },
    { value: "Cumulative Cost Benefit ($)", type: "line", color: "#88a37f" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cost Benefit Analysis
          <span className="text-xl text-gray-600">
            {" "}
            - {controls && controls.site}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              type="number"
              tickFormatter={formatAsCurrency}
              domain={[minVal, maxVal]}
              ticks={axisHelper(minVal,maxVal,5)}
            >
              <Label
                value="Cost Benefit ($)"
                angle={-90}
                offset={-50}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip formatter={formatAsCurrency} />
            <Legend payload={customLegendPayload} />
            <Bar
              name="Annual Cost Benefit ($)"
              dataKey="annualCostBenefit"
              fill="#6a9e66"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.annualCostBenefit)}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="cumulativeCostBenefit"
              stroke="#88a37f"
              name="Cumulative Cost Benefit ($)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CostBenefitChart;
