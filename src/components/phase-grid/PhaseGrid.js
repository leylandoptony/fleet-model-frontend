import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import React,{ useState, useEffect, useMemo } from "react"; // React State Management
import usePhases from "../../store/usePhases";
import { Button } from "../ui/button";
import useAuthStore from "../../store/useAuthStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useColumnState from "../../store/useColumnState";
import { Label } from "../ui/label";
import useProForma from "../../store/useProForma";


const formatAsCurrency = (number) => {
  if (number === null || number === undefined) return "";
  if (number===0) return "-";
  return `$${Math.floor(number).toLocaleString()}`;
};
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const PhaseGrid = ({gridApi,setGridApi,rowData,setRowData}) => {
  const { addPhase, updatePhase} =
    usePhases();
  const {fetchAndUpdateFleet,phases:phaseObj,controls,cityInfo} = useProForma();
  const {phases}=phaseObj;
  const { user } = useAuthStore();
  const { phaseColumns, setPhaseColumns } = useColumnState();

  const [siteOptions, setSiteOptions] = useState(
    controls.domiciles?.map((option) => option) || []
  );

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.addEventListener("bodyScroll", onBodyScroll);
  };

  // Fetch data & update rowData state


  useEffect(() => {
    setSiteOptions(controls.domiciles?.map((option) => option) || []);
  }, [controls]);
  useEffect(() => {
    setRowData(phases);
  }, [phases]); //maybe change this

  // Row Data: The data to be displayed.

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "year", editable: true, pinned: true },
    {
      field: "site",
      editable: true,

      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: siteOptions,
      },
      pinned: true,
    },
    {
      field:  "port_less_than_10_kw",
      cellStyle: { textAlign: "right" },
      editable: true,
      type: "number",
      valueFormatter: (params) => params.value === 0 ? "-" : params.value
    },
    {
      headerName: "Ports 10-20 kW",
      field: "port_10_20_kw",
      cellStyle: { textAlign: "right" },
      editable: true,
      type: "number",
      valueFormatter: (params) => params.value === 0 ? "-" : params.value
    },
    {
      headerName: "Ports 25 kW",
      field: "port_25_kw",
      cellStyle: { textAlign: "right" },
      editable: true,
      type: "number",
      valueFormatter: (params) => params.value === 0 ? "-" : params.value
    },
    {
      headerName: "Ports 180-200 kW",
      field: "port_180_200_kw",
      cellStyle: { textAlign: "right" },
      editable: true,
      type: "number",
      valueFormatter: (params) => params.value === 0 ? "-" : params.value
    },
    {
      headerName: "Loan Amount",
      field: "loan_amount",
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
      editable: true,
    },
    {
      headerName: "Capital Planning Funding",
      field: "capital_planning_funding",
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
      editable: true,
    },
    {
      headerName: "Trenching Costs",
      field: "trenching_costs",
      editable: true,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Upgrade Cost Utility",
      field: "upgrade_cost_utility",
      editable: true,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Upgrade Cost (customer)",
      field: "upgrade_cost_customer",
      type: "currency",
      editable: true,
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Procurement Management Cost",
      field: "procurement_management_cost",
      editable: true,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Public Works Engineering Costs",
      field: "estimated_public_works_engineering_costs",
      editable: true,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Incentives, Rebates, and Credits",
      headerTooltip: "Recorded as cost reduction at point-of-sale",
      field: "incentives",
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
      editable: true,
    },

    {
      headerName: "Charger Equipment Cost",
      field: "cost",
      editable: false,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: {
        textAlign: "right",
        fontWeight: "bold",
        color: "black",
        border: "none",
        background: "#F2F2F2",
      },
    },
    {
      headerName: "Installation Cost",
      field: "installCost",
      editable: false,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: {
        textAlign: "right",
        fontWeight: "bold",
        color: "black",
        border: "none",
        background: "#F2F2F2",
      },
    },
  ]);

  useEffect(() => {
    if (siteOptions.length > 0) {
      setColDefs((prevColDefs) =>
        prevColDefs.map((colDef) =>
          colDef.field === "site"
            ? {
                ...colDef,
                cellEditorParams: {
                  ...colDef.cellEditorParams,
                  values: siteOptions,
                },
              }
            : colDef
        )
      );
    }
  }, [siteOptions]);


  useEffect(() => {
    setColDefs((prevColDefs) =>
      prevColDefs.map((colDef) => {
        if (colDef.field === "port_less_than_10_kw") {
          return {
            ...colDef,
            headerName: cityInfo.range_1 ? "Ports " + cityInfo.range_1 : "Ports <10 kW",
          };
        } else if (colDef.field === "port_10_20_kw") {
          return {
            ...colDef,
            headerName: cityInfo.range_2 ? "Ports " + cityInfo.range_2 : "Ports 10-20 kW",
          };
        } else if (colDef.field === "port_25_kw") {
          return {
            ...colDef,
            headerName: cityInfo.range_3 ? "Ports " + cityInfo.range_3 : "Ports 25 kW",
          };
        } else if (colDef.field === "port_180_200_kw") {
          return {
            ...colDef,
            headerName: cityInfo.range_4 ? "Ports " + cityInfo.range_4 : "Ports 180-200 kW",
          };
        } else {
          return colDef;
        }
      })
    );
  }, [cityInfo]);


  const handleCellValueChanged = async (event) => {
    const updatedData = event.data;
    const field = event.colDef.field;
    let value = event.newValue;
    if (value === null || value === undefined) {
      value = 0;
      event.node.setDataValue(field, value); // Immediately update the cell value in the grid
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/phases/patch`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: value, id: updatedData.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      await updatePhase(result[0]);
      await fetchAndUpdateFleet("phases");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
      skipHeader: false,
    };
  }, []);

  const onGridPreDestroyed = (event) => {
    setPhaseColumns(event.state);
  };
  const [shadow, setShadow] = useState(true);
  const onBodyScroll = (event) => {
    const horizontalScrollPosition = event.api.getHorizontalPixelRange();
    // const scrollWidth = event.api.gridPanel.getBodyClientRect().width;
    const size = event.api.getColumnState();
    // const maxScrollLeft = horizontalScrollPosition.right - scrollWidth;
    const totalWidth = size.reduce((total, obj) => {
      if (!obj.pinned && !obj.hide) {
        return total + obj.width;
      }
      return total;
    }, 0);
    if (totalWidth - horizontalScrollPosition.right < 1) {
      setShadow(false);
    } else {
      setShadow(true);
    }
  };

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the grid theme
    >
      <div className="relative">
        <AgGridReact
          initialState={phaseColumns}
          autoSizeStrategy={isEmpty(phaseColumns) ? autoSizeStrategy : {}}
          domLayout="autoHeight"
          stopEditingWhenCellsLoseFocus={true}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection="single"
          onCellValueChanged={handleCellValueChanged}
          onGridReady={onGridReady}
          suppressColumnVirtualisation={true}
          maintainColumnOrder={true}
          onGridPreDestroyed={onGridPreDestroyed}
          tooltipShowDelay={0}
        />
        {shadow && (
          <div className="h-full absolute top-0 right-0 bottom-0 w-5 bg-gradient-to-r from-transparent to-black/10 pointer-events-none z-20 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};

export default PhaseGrid;
