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
  BarChart,
  Bar,
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

const TimelineGraph = () => {
  const {
    proFormaCalcs,
    years,
    yearOverYear,
    controls = {},
    fleetData = [],
  } = useProForma();
  const { YEARS = [] } = years;
  // Initialize counters for each year
  const vehicleCounts = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});

  const allSitesVehicleCounts = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});

  const maxCounter = YEARS.reduce((acc, year) => {
    acc[year] = 0;
    return acc;
  }, {});

  let maxVehicleCount = 0;

  fleetData.forEach((vehicle) => {
    const replacementYear = vehicle["Replacement Year"];
    if (replacementYear in maxCounter) {
      maxCounter[replacementYear]++;
    }
    if (maxCounter[replacementYear] > maxVehicleCount) {
      maxVehicleCount = maxCounter[replacementYear];
    }
  });
  maxVehicleCount += 2;

  // Count vehicles for each year based on the "Replacement Year"
  fleetData.forEach((vehicle) => {
    const replacementYear = vehicle["Replacement Year"];
    const site = vehicle["Simplified Domicile"];
    if (
      replacementYear in vehicleCounts &&
      (site === controls.site || controls.site === "All Sites")
    ) {
      vehicleCounts[replacementYear]++;
    }
  });

  fleetData.forEach((vehicle) => {
    const replacementYear = vehicle["Replacement Year"];
    const site = vehicle["Simplified Domicile"];
    allSitesVehicleCounts[replacementYear]++;
  });

  const data = Object.entries(vehicleCounts).map(([year, count]) => ({
    year: Number(year),
    vehicleCount: count,
  }));

  const data2 = Object.entries(allSitesVehicleCounts).map(([year, count]) => ({
    year: Number(year),
    vehicleCount: count,
  }));

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].vehicleCount !== 0 || data2[i].vehicleCount !== 0) {
      break;
    }
    data.pop();
    data2.pop();
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Zero-Emission Vehicle (ZEV) Timeline</CardTitle>
        <CardDescription>{controls && controls.site}</CardDescription>
      </CardHeader>

      <CardContent className="h-3/4">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              type="number"
              tickFormatter={(value) => Math.round(value)}
              tickCount={5}
              domain={[0, Math.ceil(maxVehicleCount / 4) * 4]}
            >
              <Label
                value="Count of ZEV Replacements"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip formatter={(value) => Math.round(value)} />
            <Legend />
            <Bar
              data={data2}
              dataKey="vehicleCount"
              fill="#82ca9d"
              name="All Sites Vehicles"
            />
            {controls.site !== "All Sites" && (
              <Bar
                dataKey="vehicleCount"
                fill="#6a7b9e"
                name={controls && `${controls.site} Vehicles`}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimelineGraph;
