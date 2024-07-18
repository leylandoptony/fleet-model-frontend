import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useProForma from "../../store/useProForma";
import { SewingPinFilledIcon } from "@radix-ui/react-icons";


const PrioritySite = () => {
  const {controls} = useProForma();

  return (
    <Card className="h-full relative">
      <CardHeader>
        <CardTitle className="flex items-center"><SewingPinFilledIcon width="18" height="18"/>Selected Site</CardTitle>
      </CardHeader>

      <CardContent className="h-3/4 absolute bottom-0 w-full text-xl font-semibold flex items-center justify-center">
      {controls && controls.site}
      </CardContent>
    </Card>
  );
};

export default PrioritySite;
