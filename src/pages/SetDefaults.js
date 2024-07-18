import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useAuthStore from "../store/useAuthStore";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import useProForma from "../store/useProForma";


function SetDefaults() {
  const { user } = useAuthStore();
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState("");
  const { fetchAndUpdateFleet } = useProForma();

  const onDrop = (acceptedFiles) => {
    setCsvFile(acceptedFiles[0]);
  };
  const uploadCSVFile = async () => {
    if (!user) {return;}

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("userId", user.id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}reupload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const res = await response.json();
        const errorMessage = `CSV format is incorrect.\nServer message: ${res.error}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      setMessage(`${result.message}`);
      fetchAndUpdateFleet();
    } catch (error) {
      setMessage(`Error uploading data: ${error.message}`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  const saveDefault = async (tableName) => {
    if (!user) {
      return;
    }
    const userId = user.id; // Assume user object has an id property

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/save-default?userId=${userId}&tableName=${tableName}`,
        {
          method: "GET", // Use GET method
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save defaults");
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error saving defaults:", error);
    }
  };

  if (!user) {
    return <div>Log in with a user!</div>;
  }

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-normal lg:text-5xl text-optonygreen mb-4">
        Set Defaults
      </h1>
      <div className="flex flex-col gap-2 w-60">
        <Button
          className="relative top-2"
          onClick={() => saveDefault("fleet data")}
        >
          Save Default Fleet
        </Button>
        <Button
          className="relative top-2"
          onClick={() => saveDefault("phases")}
        >
          Save Default Phases
        </Button>
        <Button
          className="relative top-2"
          onClick={() => saveDefault("advanced controls")}
        >
          Save Default Advanced Controls
        </Button>
        <p className="text-sm text-red-400">{message}</p>
        <div
          className="border border-4 rounded-md border-dashed p-5 hover:border-gray-400 text-center"
          {...getRootProps()}
        >
          <Input {...getInputProps()} />
          {csvFile ? (
            <p>{csvFile.name}</p>
          ) : (
            <p>Drag & Drop Vehicle CSV file here</p>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button  variant="outline" className="relative">Replace Fleet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure you want to do this?</DialogTitle>
              <DialogDescription>
                Uploading a new CSV file will replace the current fleet data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="">
              <DialogClose asChild>
                <Button onClick={uploadCSVFile} type="submit">
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default SetDefaults;
