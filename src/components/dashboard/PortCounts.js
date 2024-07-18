import React from "react";
import useProForma from "../../store/useProForma";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { axisHelper } from "../../utils/graphs/axisHelper";


const colorMap ={
    0:"6a7b9e",
    1:"88a37f",
    2:"437b6f",
    3:"efd844",
    4:"f7a278",
    5:"dcef68",
}

const PortCounts = () => {
  // Your component logic goes here
  const { phases = {}, controls = {} } = useProForma();
  const phaseData = phases?.phases || [];
  const uniqueYears = [...new Set(phaseData.map((item) => item.year))];
  const uniqueSites = controls?.domiciles;
  const yearSiteObject = uniqueYears.reduce((acc, year) => {
    acc[year] = uniqueSites.reduce((siteAcc, site) => {
      siteAcc[site] = 0;
      return siteAcc;
    }, {});
    return acc;
  }, {});

  phaseData.forEach((phase) => {
    if (
      phase.year in yearSiteObject &&
      phase.site in yearSiteObject[phase.year]
    ) {
      yearSiteObject[phase.year][phase.site] +=
        phase.port_10_20_kw +
        phase.port_25_kw +
        phase.port_180_200_kw +
        phase.port_less_than_10_kw;
    }
  });
  console.log(yearSiteObject);

  const data = Object.entries(yearSiteObject).map(([year, sites]) => {
    const entry = { year };
    Object.entries(sites).forEach(([site, count]) => {
      entry[site] = count;
    });
    return entry;
  });

  let max = 0;
  data.forEach((entry) => {
    let tempCount=0
    controls?.domiciles.forEach((site) => {
      tempCount+=entry[site]
    })
    if (tempCount>max){
      max=tempCount
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ports by Site</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, Math.ceil((max*1.1) / 4) * 4]} ticks={axisHelper(0,Math.ceil((max*1.1) / 4) * 4,5)}>
            <Label
                value="Ports"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip />
            <Legend />
            {uniqueSites?.map((site,index) => (
              <Bar
                key={site}
                dataKey={site}
                stackId="a"
                fill={`#${colorMap[index]}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortCounts;
