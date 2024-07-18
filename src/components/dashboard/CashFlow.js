import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useProForma from "../../store/useProForma";
import { TfiMoney } from "react-icons/tfi";


const formatCurrency = (value) => {
  // Check if the value is exactly 0 or rounds to 0
  if (value === 0 || Math.round(value) === 0) {
    return "$-";
  }
  
  // Round the value to the nearest integer
  const roundedValue = Math.round(value);
  
  const absValue = Math.abs(roundedValue)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return roundedValue < 0 ? `-$${absValue}` : `$${absValue}`;
};
const CashFlow = () => {
  
  const [year, setYear] = useState(2040); // Default year is 2040
  const {yearOverYear}=useProForma();
  const { annualCostBenefit={} } = yearOverYear;


  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const val = annualCostBenefit[year] ?? annualCostBenefit[2040];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TfiMoney size={16} />
        Cash Flow</CardTitle>
        <CardDescription className="">All Sites</CardDescription>
      </CardHeader>

      <CardContent className="">
        <div className="flex mb-2 justify-center items-center">
          <p>Estimated Cash Flow By</p>
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            className="w-24 ml-2 border rounded p-1 flex-1"
          />
        </div>

        <p
          className={
            Math.round(val) === 0
              ? "text-black font-semibold"
              : Math.round(val) < 0
              ? "text-red-500 font-semibold"
              : "text-[#008000] font-semibold"
          }
        >
          {val && formatCurrency(val)}
        </p>
      </CardContent>
    </Card>
  );
};

export default CashFlow;
