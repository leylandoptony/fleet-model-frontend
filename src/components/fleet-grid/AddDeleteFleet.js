import React from "react";
import { Button } from "../ui/button";
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
import useAuthStore from "../../store/useAuthStore";
import usePhases from "../../store/usePhases";
import useProForma from "../../store/useProForma";
import { Label } from "../ui/label";


const AddDeleteFleet = ({ gridApi,rowData,setRowData }) => {
  // Handle adding a new row
  const { user } = useAuthStore();
  const { addPhase, updatePhase } = usePhases();
  const {fetchAndUpdateFleet,phases:phaseObj,controls,cityInfo} = useProForma();
  const {phases}=phaseObj;
  const handleAddRow = async () => {
  };

  const handleDeleteRow = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const remainingRows = rowData.filter((row) => !selectedData.includes(row));
    setRowData(remainingRows);

    // Optionally, send a delete request to your server
    selectedData.forEach(async (row) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ROUTE}api/fleet/${row.equipment_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        console.log(response)
        await fetchAndUpdateFleet("fleetData");
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    });
  };

  return (
    <div className="flex lg:flex-col gap-2">
      <Button variant="secondary" onClick={handleAddRow}>
        Add Vehicle
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="relative">
            Delete Vehicle
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure you want to do this?</DialogTitle>
            <DialogDescription>
              Deleting a vehicle is irreversible and will remove all data
              associated with it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
            </div>
          </div>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button onClick={handleDeleteRow} type="submit">
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDeleteFleet;
