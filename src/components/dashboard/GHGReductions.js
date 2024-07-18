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
import { LiaLeafSolid } from "react-icons/lia";

const GHGReductions = () => {
  const { proFormaCalcs, years, controls } = useProForma();
  const { END_YEAR } = years;
  const { ghgReductions = {} } = proFormaCalcs;
  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle className="flex items-start gap-2">
          <LiaLeafSolid  size={16}/>
          GHG Reductions
        </CardTitle>
        <CardDescription>{controls && controls.site}</CardDescription>
      </CardHeader>

      <CardContent className="h-3/4 absolute bottom-0 w-full flex items-center justify-center ">
        <p>
          <span className="text-lg font-semibold">
            {ghgReductions[END_YEAR - 1] &&
              Math.floor(ghgReductions[END_YEAR - 1])}
          </span>{" "}
          {controls && (
            <span>
              MTCO<sub>2</sub>e
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default GHGReductions;
