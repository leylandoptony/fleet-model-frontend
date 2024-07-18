import React from "react";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import usePhases from "../store/usePhases";
import ResetButton from "../components/ResetButton";
import PhaseGrid from "../components/phase-grid/PhaseGrid.js";
import AddPhaseButton from "../components/phase-grid/AddPhaseButton.js";
import { jsonToCsv } from "../utils/jsonToCsv";
import useProForma from "../store/useProForma";
import { Button } from "../components/ui/button";

const filterOut = (obj)=> {
  obj.forEach((item) => {
    delete item.user_id
    delete item.id
  })
  return obj
}


function Phases() {
  const { user } = useAuthStore();
  const { phases } = useProForma();

  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const filename = "phases.csv";
  const downloadCsv = () => {
    const csv = jsonToCsv(filterOut(phases.phases));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <div className="flex lg:flex-col lg:mb-4 items-center mb-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-normal lg:text-5xl text-optonygreen mr-9 lg:mr-0 font-franklin tracking-wide">
          Infrastructure Phases
        </h1>
        <ResetButton tableName="phases" />
        <Button variant="outline" onClick={downloadCsv} className="ml-4">
          Export Phases
        </Button>
        
      </div>
      <PhaseGrid gridApi={gridApi} setGridApi={setGridApi} rowData={rowData} setRowData={setRowData}/>
      <AddPhaseButton gridApi={gridApi} rowData={rowData} setRowData={setRowData} />
    </div>
  );
}

export default Phases;
