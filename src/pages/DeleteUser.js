// src/DeleteUser.js
import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";
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

const DeleteUser = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleDeleteUser = async (e) => {

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const result = await response.json();
      setMessage(result.message);

      // Optionally navigate to another page or reset the form
      setUserId("");
    } catch (error) {
      setMessage(`Error deleting user: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="h-[300px] w-[400px] p-4">
        <CardHeader className="pb-5">
          <CardTitle>Delete User</CardTitle>
          <CardDescription>Enter the User ID to delete</CardDescription>
          <p className="text-sm">{message}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeleteUser}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>User ID</Label>
                <Input
                  type="text"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="relative top-2">Delete User</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to do this?
                      </DialogTitle>
                      <DialogDescription>
                        Deleting a user is irreversible.
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
                        <Button onClick={handleDeleteUser} type="submit">Delete</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteUser;
