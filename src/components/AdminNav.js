import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "./ui/navigation-menu";
import { Link,NavLink } from "react-router-dom";
import { ExitIcon } from "@radix-ui/react-icons";

const AdminNav = () => {
  return (
    <div className="w-full flex justify-center mt-0">
      <NavigationMenu>
        <NavigationMenuList>
        <NavigationMenuItem>
            <Link to="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ExitIcon/>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavLink to="/admin">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive
                    ? "bg-gray-200"
                    : "hover:bg-[#bacfb4]"
                }`}
              > Create User
              </NavigationMenuLink>
            )}
          </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavLink to="/delete-user">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive
                    ? "bg-gray-200"
                    : "hover:bg-[#bacfb4]"
                }`}
              > Delete User
              </NavigationMenuLink>
            )}
          </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavLink to="/set-info">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive
                    ? "bg-gray-200"
                    : "hover:bg-[#bacfb4]"
                }`}
              > Set User Info
              </NavigationMenuLink>
            )}
          </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavLink to="/set-defaults">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive
                    ? "bg-gray-200"
                    : "hover:bg-[#bacfb4]"
                }`}
              > Set Defaults
              </NavigationMenuLink>
            )}
          </NavLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default AdminNav;
