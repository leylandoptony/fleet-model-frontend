import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  Pencil2Icon,
  PersonIcon,
  CalendarIcon,
  BarChartIcon,
  GearIcon,
  DesktopIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import useAuthStore from "../store/useAuthStore";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// src/Navbar.js

const Navbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="h-screen w-[250px] fixed border-r bg-[#ecf7e6] rounded-r-xl">
      
      <div className="flex items-center justify-left h-8 pl-4 mt-4">
        <img src="/optony.png" alt="Logo" className="h-8" />
      </div>
      <p data-testid="title" className="text-[#505c54] pl-4 text-2xl font-franklin tracking-wide">Pro Forma</p>
      <nav className=" p-5">
        <ul className="">
          <NavLink to="/">
            {({ isActive }) => (
              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 ${
                  isActive
                    ? "bg-[#83a679] text-white"
                    : "hover:bg-[#bacfb4]"
                }`}
              >
                <DesktopIcon className="mr-2" width="20" height="20" />
                Dashboard
              </li>
            )}
          </NavLink>
          <NavLink to="/advanced-controls">
            {({ isActive }) => (
              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 ${
                  isActive
                    ? "bg-[#83a679] text-white"
                    : "hover:bg-[#bacfb4]"
                }`}
              >
                <GearIcon className="mr-2" width="18" height="18" />
                Advanced Controls
              </li>
            )}
          </NavLink>
          <NavLink to="/yearoveryear">
            {({ isActive }) => (
              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 ${
                  isActive
                    ? "bg-[#83a679] text-white"
                    : "hover:bg-[#bacfb4]"
                }`}
              >
                 <BarChartIcon className="mr-2" width="18" height="18" />
                 Year Over Year
              </li>
            )}
          </NavLink>
          <NavLink to="/phases">
            {({ isActive }) => (
              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 ${
                  isActive
                    ? "bg-[#83a679] text-white"
                    : "hover:bg-[#bacfb4]"
                }`}
              >
                 <CalendarIcon className="mr-2" width="18" height="18" />
                 Infrastructure Phases
              </li>
            )}
          </NavLink>
          <NavLink to="/fleet-editor">
            {({ isActive }) => (
              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 ${
                  isActive
                    ? "bg-[#83a679] text-white"
                    : "hover:bg-[#bacfb4]"
                }`}
              >
                <Pencil2Icon className="mr-2" width="18" height="18" />
                Fleet Editor
              </li>
            )}
          </NavLink>
        </ul>
        <Dialog>
          <DialogTrigger asChild>
          <NavLink>

              <li
                className={`flex items-center rounded-md py-4 text-sm font-medium mb-2 px-4 hover:bg-[#bacfb4]`}
              >
                <ExitIcon className="mr-2" width="18" height="18" />
                Log Out
              </li>
          </NavLink>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure you want to log out?</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button data-testid="logOutButton" onClick={handleLogout} type="submit">
                  Log Out
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
};

export default Navbar;
