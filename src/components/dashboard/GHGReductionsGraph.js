// src/GHGReductionsGraph.js
import React from "react";
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

const transformData = (ghgReductions) => {
  const data = [];

  Object.keys(ghgReductions).forEach((year) => {
    data.push({
      year: parseInt(year, 10),
      ghgReductions: ghgReductions[year],
    });
  });

  return data;
};

const GHGReductionsGraph = () => {
  const { controls,proFormaCalcs,allSitesProFormaCalcs } = useProForma();

  const { subtractedReductions={} } = proFormaCalcs;
  const { subtractedReductions: allSitesGHGReductions={} } = allSitesProFormaCalcs;
  const maxGHGReductions = Math.max(...Object.values(allSitesGHGReductions));
  const yAxisMax = Math.ceil(maxGHGReductions / 5) * 5;

  // Rest of the code...

  const data = transformData(subtractedReductions);
  const allSitesData = transformData(allSitesGHGReductions);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>GHG Emissions</CardTitle>
        <CardDescription>{controls && controls.site}</CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <div className="absolute bottom-16 left-4 -rotate-90 origin-top-left translate-y-full pb-2 text-sm text-gray-600">
          GHG Emissions (MTCO<sub>2</sub>e)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart className="" data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(value) => Math.round(value)}
              tickCount={4}
            >
            </YAxis>
            <Tooltip formatter={(value) => Math.round(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ghgReductions"
              stroke="#6a7b9e"
              name="Selected Site"
            />
            {allSitesData && (
              <Line
                type="monotone"
                data={allSitesData}
                dataKey="ghgReductions"
                stroke="#82ca9d"
                name="All Sites"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GHGReductionsGraph;
