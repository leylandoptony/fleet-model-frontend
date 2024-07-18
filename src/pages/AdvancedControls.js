// src/pages/AdvancedControls.js
import React from "react";
import { useRef } from "react";
import Economics from "../components/advanced-controls/Economics";
import SoftwareCosts from "../components/advanced-controls/SoftwareCosts";
import { Button } from "../components/ui/button";
import useAdvancedCalc from "../store/useAdvancedCalc";
import ResetButton from "../components/ResetButton";
import { Card } from "../components/ui/card";
import CostBenefitChart from "../components/dashboard/CostBenefitChart";
import CostAndSavings from "../components/dashboard/TotalCostsGraph";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useProForma from "../store/useProForma";

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;

}

function AdvancedControls() {
  const economicsRef = useRef(null);
  const softwareCostsRef = useRef(null);
  const { advancedControls } = useProForma();

  return (
    <div data-testid="advanced-controls-page">
      <div className="flex lg:flex-col lg:mb-4 items-center mb-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-normal lg:text-5xl text-optonygreen mr-9 lg:mr-0 font-franklin tracking-wide">
          Advanced Controls
        </h1>
        <ResetButton tableName="advanced controls" />
      </div>
      {(isEmpty(advancedControls)) && (
        <div className="w-full h-full flex justify-center items-center z-20 bg-white">
          <LoadingSpinner />
        </div>
      )}
      <div className={`w-full flex flex-row-reverse lg:flex-col-reverse ${(isEmpty(advancedControls))?"hidden":""}`}>
        <div className="w-1/2 flex flex-col gap-10 lg:w-full">
          <CostBenefitChart />
          <CostAndSavings />
        </div>
        <div className="w-1/2 flex flex-col items-center pb-16 lg:w-full">
          <div className="flex flex-col gap-5 lg:w-full">
            <Card className="flex flex-col items-center">
              <Economics ref={economicsRef} />
              <SoftwareCosts ref={softwareCostsRef} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedControls;
