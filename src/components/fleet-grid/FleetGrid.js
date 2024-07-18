import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import React,{ useState, useEffect, useRef, useCallback } from "react"; // React State Management
import useAuthStore from "../../store/useAuthStore";
import useColumnState from "../../store/useColumnState";
import useProForma from "../../store/useProForma";
import { Button } from "../../components/ui/button";
import { set } from "react-hook-form";
import { getCharger,getIndivCharger } from "./getCharger";


const formatAsCurrency = (number) => {
  if (number === null || number === undefined) return "";
  return `$${Math.floor(number).toLocaleString()}`;
};
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};




const FleetModelGrid = ({setGridApi,gridApi,rowData,setRowData}) => {
  const { fleet, setFleetState } = useColumnState();
  console.log(fleet)
  const { user } = useAuthStore();
  const {fetchAndUpdateFleet,fleetData,updateFleet,controls,cityInfo} = useProForma();
  const [shadow, setShadow] = useState(true);
  const [siteOptions, setSiteOptions] = useState(
    controls.domiciles?.map((option) => option) || []
  );
  const gridRef = useRef(null);
  // Fetch data & update rowData state
  useEffect(() => {
     fetchAndUpdateFleet("fleetData");
  }, [user]); // Dependency array

  useEffect(() => {
    setSiteOptions(controls.domiciles?.map((option) => option) || []);
  }, [controls]);

  useEffect(() => {
    setRowData(fleetData);
  }, [fleetData]);

  const hiddenCols = ["ghg","Annual KWh","EV Annual Maintenance Costs","Existing Vehicle Annual Maintenance","EV Annual Charging Costs","Existing Vehicle Annual Fuel Costs"];

  const handleToggle = () =>{
    setColDefs((prevColDefs) =>
      prevColDefs.map((colDef) =>{
        if (hiddenCols.includes(colDef.field)){
          const prev = colDef.hide
          return {
            ...colDef,
            hide:!prev
          }
        }else{
          return colDef
        }
      }
      )
    );
  }


  const onGridReady = async (params) => {
    setGridApi(params.api);
    params.api.addEventListener("bodyScroll", onBodyScroll);
    if (fleet.pagination) {
      params.api.paginationGoToPage(fleet.pagination.page);
    }
    await fetchAndUpdateFleet("fleetData");
  };
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
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "Equipment ID", editable: true},
    {
      field: "description",

      editable:true,

    },
    {
      headerName: "Site",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: siteOptions,
      },
      field: "Simplified Domicile",
      editable: true,
    },
    {
      field: "Replacement Year",
      editable: true,
      type: "number",
      cellEditorParams: {
        min: 2000,
        max: 2100,
      },
      
    },
    {
      field: "Expected Lifetime",
      editable: true,
      type: "number",
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "EV MSRP",
      field: "EV Purchase Cost pre-incentive",
      type: "currency",
      editable:true,
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Existing Vehicle Estimated MSRP",
      field: "Default Replacement Allocation",
      type: "currency",
      editable:true,
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "State and Local Incentives",
      field: "state_incentives",
      type: "currency",
      editable: true,
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Federal Incentives",
      field: "IRA Incentives",
      editable: true,
      type: "currency",
      valueFormatter: (params) => formatAsCurrency(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Vehicle Type",
      field: "vehicle_type",
      editable: true,

    },
    {
      headerName: "GHG Emissions",
      field: "ghg",
      editable: true,
      initialHide: true,
      valueFormatter: (params) => params.value.toFixed(1),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Annual KWh",
      field: "Annual KWh",
      editable: true,
      initialHide: true,
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatAsCurrency(params.value),
      
    },
    {
      headerName: "EV Annual Maintenance Costs",
      field: "EV Annual Maintenance Costs",
      editable: true,
      initialHide: true,
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatAsCurrency(params.value),
    },
    {
      headerName: "Existing Vehicle Annual Maintenance",
      field: "Existing Vehicle Annual Maintenance",
      editable: true,
      initialHide: true,
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatAsCurrency(params.value),
    },
    {
      headerName: "EV Annual Charging Costs",
      field: "EV Annual Charging Costs",
      editable: true,
      initialHide: true,
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatAsCurrency(params.value),
    },
    {
      headerName: "Existing Vehicle Annual Fuel Costs",
      field: "Existing Vehicle Annual Fuel Costs",
      editable: true,
      initialHide: true,
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatAsCurrency(params.value),
    },
    {
      headerName: "Charger Assignment",
      field: "charger_assignment",
      editable: true,
      cellEditor: "agSelectCellEditor",
      valueFormatter: (params) => getIndivCharger(cityInfo,params.value),
      cellEditorParams: {
        values: [1,2,3,4],
      },
    },
  ]);

  useEffect(() => {
    if (siteOptions.length > 0) {
      setColDefs((prevColDefs) =>
        prevColDefs.map((colDef) =>
          colDef.field === "Simplified Domicile"
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


  const handleCellValueChanged = async (event, undo = false) => {
    const field = event.colDef.field;
    let value = event.newValue;

    if (value === null || value === undefined) {
      if (field === "Replacement Year") {
        value = 2024;
      } else {
        value = 0;
      }

      event.node.setDataValue(field, value); // Immediately update the cell value in the grid
    }
    updateFleet(event,value)
    
  };

  const onGridPreDestroyed = (event) => {
    setFleetState(event.state);
  };
  const getRowId = (params) => {
    return params.data.id;
  };

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz relative h-[95%]" // applying the grid theme
    >
    {/* <Button onClick={handleToggle}>Toggle Hidden</Button> */}
      <AgGridReact
        initialState={fleet}
        ref={gridRef}
        autoSizeStrategy={
          isEmpty(fleet) ? { type: "fitCellContents", skipHeader: false} : {}
        }
        tooltipShowDelay={0}
        stopEditingWhenCellsLoseFocus={true}
        pagination={true}
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={handleCellValueChanged}
        onGridReady={onGridReady}
        suppressColumnVirtualisation={true}
        onGridPreDestroyed={onGridPreDestroyed}
        getRowId={getRowId}
        rowSelection="single"

      />
      {shadow && (
        <div className="h-full absolute top-0 right-0 bottom-0 w-5 bg-gradient-to-r from-transparent to-black/10 pointer-events-none z-20 rounded-lg"></div>
      )}
    </div>
  );
};

export default FleetModelGrid;
