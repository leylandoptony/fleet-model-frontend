import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

const InfrastructureCosts = () => {
  const [chargingOptimization, setChargingOptimization] = useState(false);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Infrastructure Cost and Sensitivities</CardTitle>
        <CardDescription>Modify infrastructure cost of your fleet</CardDescription>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Charging Optimization</Label>
                <Switch
                  checked={chargingOptimization}
                  onCheckedChange={(checked) =>
                    setChargingOptimization(checked)
                  }
                />
              </div>
              {chargingOptimization ? (
                <div className="flex flex-col space-y-1.5">
                  <Label>Charging Optimization Savings</Label>
                  <Input variant="blank" value="$1000" type="" placeholder="" />
                </div>
              ) : (
                <div className="flex flex-col space-y-1.5">
                  <Label>Charging Optimization Savings</Label>
                  <Input disabled variant="blank" value="$1000" type="" placeholder="" />
                </div>
              )}

              <div className="flex flex-col space-y-1.5">
                <Label>Charging Management Subscription Costs</Label>
                <Input variant="blank" value="$450" type="" placeholder="" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Charging Network Costs</Label>
                <Input variant="blank" value="$0" type="" placeholder="" />
              </div>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default InfrastructureCosts;
