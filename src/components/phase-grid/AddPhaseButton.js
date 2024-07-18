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


const AddPhaseButton = ({ gridApi,rowData,setRowData }) => {
  // Handle adding a new row
  const { user } = useAuthStore();
  const { addPhase, updatePhase } = usePhases();
  const {fetchAndUpdateFleet,phases:phaseObj,controls,cityInfo} = useProForma();
  const {phases}=phaseObj;
  const handleAddRow = async () => {
    
    try {
        console.log(user)
      const newRow = {
        user_id: user.id,
        year: 2024,
        site: "",
        loan_amount: 0,
        trenching_costs: 0,
        upgrade_cost_utility: 0,
        upgrade_cost_customer: 0,
        procurement_management_cost: 0,
        capital_planning_funding: 0,
        port_less_than_10_kw: 0,
        port_10_20_kw: 0,
        port_25_kw: 0,
        port_180_200_kw: 0,
        incentives: 0,
        cost: 0,
        installCost: 0,
      };
      const response = await addPhase(newRow);
      await fetchAndUpdateFleet("phases");

      if (!response.ok) {
        throw new Error("Failed to add data");
      }
      setRowData(phases); // Add the new row to the state
    } catch (error) {
      console.error("Error adding data:", error);
    }
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
    <div className="flex lg:flex-col gap-2 mt-2">
      <Button variant="secondary" onClick={handleAddRow}>
        Add Infrastructure Project
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="relative">
            Delete Selected Infrastructure Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure you want to do this?</DialogTitle>
            <DialogDescription>
              Deleting a phase is irreversible and will remove all data
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

export default AddPhaseButton;
