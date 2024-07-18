import React, { useState } from "react";
import ResetButton from "../components/ResetButton";
import FleetGrid from "../components/fleet-grid/FleetGrid";
import { jsonToCsv } from "../utils/jsonToCsv";
import { Button } from "../components/ui/button";
import useProForma from "../store/useProForma";
import AddDeleteFleet from "../components/fleet-grid/AddDeleteFleet";

const filterOut = (obj) => {
  obj.forEach((item) => {
    delete item.equipment_id;
    delete item.user_id;
    delete item.id;
  });
  return obj;
};

function FleetEditor() {
  const { fleetData, fetchAndUpdateFleet } = useProForma();

  const filename = "fleet-data.csv";
  const downloadCsv = () => {
    const data = [...fleetData];
    data.map((item) => {
      delete item["electrification_scenario"];
      return item;
    });
    const csv = jsonToCsv(filterOut(data));
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

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(null);

  // Store gridApi to access selected rows
  const [gridApi, setGridApi] = useState(null);

  const handleDeleteRow = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const remainingRows = rowData.filter((row) => !selectedData.includes(row));
    setRowData(remainingRows);

    // Optionally, send a delete request to your server
    selectedData.forEach(async (row) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ROUTE}api/phases/${row.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        await fetchAndUpdateFleet("phases");
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    });
  };

  return (
    <div className="h-full">
      <div className="flex lg:flex-col lg:mb-4 justify-between mb-4">
        <div className="flex items-center">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-normal lg:text-5xl text-optonygreen mr-9 lg:mr-0 font-franklin tracking-wide">
            Fleet Editor
          </h1>
          <ResetButton tableName="fleet data" />
          <Button variant="outline" onClick={downloadCsv} className="ml-4">
            Export Fleet
          </Button>
        </div>

        <div>
          {/* <AddDeleteFleet  rowData={rowData} setRowData={setRowData} gridApi={gridApi}/> */}
        </div>
      </div>

      <FleetGrid
        rowData={rowData}
        setRowData={setRowData}
        gridApi={gridApi}
        setGridApi={setGridApi}
      />
    </div>
  );
}

export default FleetEditor;
