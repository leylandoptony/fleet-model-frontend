// src/pages/Dashboard.js
import React, { useEffect } from "react";
import { useState } from "react";
import Controls from "../components/dashboard/Controls";
import CostBenefitChart from "../components/dashboard/CostBenefitChart";
import CostAndSavings from "../components/dashboard/TotalCostsGraph";
import GHGReductionsGraph from "../components/dashboard/GHGReductionsGraph";
import GHGReductions from "../components/dashboard/GHGReductions";
import Timeline from "../components/dashboard/Timeline";
import TimelineGraph from "../components/dashboard/TimelineGraph";
import PortCounts from "../components/dashboard/PortCounts";

import ElectrificationScenario from "../components/dashboard/ElectrificationScenario";
import PrioritySite from "../components/dashboard/PrioritySite";
import CashFlow from "../components/dashboard/CashFlow";
import CapitalCostsGraph from "../components/dashboard/CapitalCostsGraph";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useProForma from "../store/useProForma";
import FixedControls from "../components/dashboard/FixedControls";

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

function Dashboard() {
  const { controls,cityInfo } = useProForma();
  const [renderKey, setRenderKey] = useState(0);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const controls = document.querySelector('.controls');
      if (controls) {
        const controlsBottom = controls.getBoundingClientRect().bottom;
        setIsFixed(controlsBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <>
    {isFixed && <FixedControls/>}
      <div className="flex justify-between pr-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-normal lg:text-5xl text-optonygreen mb-2 font-franklin tracking-wide">
          Dashboard
        </h1>
      </div>
      <p className="text-gray-400 text-lg">
        Welcome, {cityInfo && cityInfo.city_name}
      </p>

      {cityInfo && cityInfo.city_image && (
        <img
          src={cityInfo.city_image}
          alt="city"
          className="md:hidden absolute right-14 top-6 h-24"
        />
      )}
      {(isEmpty(controls)) && (
        <div className="w-full h-full flex justify-center items-center z-20 bg-white">
          <LoadingSpinner />
        </div>
      )}
      
      <div className={`grid grid-cols-12 gap-4 p-4 ${(isEmpty(controls))?"hidden":""}`}>
        <div className="col-span-3 xl:col-span-12 h-fill">
          <Controls />
        </div>
        <div className="col-span-5 lg:col-span-12 row-span-1 h-fill">
          <CostBenefitChart />
        </div>
        <div className="col-span-4 lg:col-span-12 row-span-1 h-fill">
          <CostAndSavings key={renderKey} />
        </div>

        <div className="col-span-3 lg:col-span-12 lg:h-[150px] row-span-1 h-fill">
          <PrioritySite />
        </div>
        <div className="col-span-3 lg:col-span-12 lg:h-[150px] lg:row-span-2  row-span-1 h-fill">
          <ElectrificationScenario />
        </div>
        <div className="col-span-3  lg:col-span-12 lg:h-[150px] row-span-1 h-fill">
          <GHGReductions />
        </div>
        <div className="col-span-3  lg:col-span-12 row-span-1 h-fill">
          <CashFlow />
        </div>
        <div className="col-span-6 lg:col-span-12 row-span-1 h-full">
          <GHGReductionsGraph />
        </div>
        <div className="col-span-6 lg:col-span-12 row-span-1 h-full">
          <CapitalCostsGraph />
        </div>
        <div className="col-span-4 lg:col-span-12 row-span-1 h-full">
          <Timeline />
        </div>
        <div className="col-span-8 lg:col-span-12 row-span-1 h-full">
          <TimelineGraph />
        </div>
        <div className="col-span-6 lg:col-span-12 row-span-1 h-full">
          <PortCounts />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
