import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useProForma from "../../store/useProForma";
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
import useCache from "../../store/useCache";
import { set } from "react-hook-form";

const FixedControls = () => {
  const { fleetData, controls, fetchAndUpdateFleet, setControl } =
    useProForma();
  const {updateControls}  = useCache();
  const { user } = useAuthStore();
  const [electrificationScenario, setElectrificationScenario] = useState("");
  const [site, setSite] = useState("");
  const [incentives, setIncentives] = useState(false);
  const [iraIncentives, setIraIncentives] = useState(false);
  const [electrificationOptions, setElectrificationOptions] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (fleetData && fleetData[0] && fleetData[0].electrification_scenario) {
      const options = Object.keys(fleetData[0].electrification_scenario);
      setElectrificationOptions(options);
    }
  }, [fleetData]);



  useEffect(() => {
    if (controls.domiciles ) {
      if (electrificationScenario) {
        setLoaded(true);
      }
      
      setElectrificationScenario(controls["electrification_scenario"]);
      const tempSites = ["All Sites", ...controls.domiciles];
      setSite(controls["site"]);
      setSiteOptions(tempSites);
      setIncentives(controls.incentives || false);
      setIraIncentives(controls.ira_incentives || false);
    }
  }, [controls, electrificationOptions]);

  const updateControl = async (attribute, value) => {
    
    if (value === "" || value === null) return;
    updateControls(attribute, value);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/controls/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attribute, value }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
    } catch (error) {
      console.error(`Error updating control: ${error.message}`);
    }
  };

  const handleElectrificationScenarioChange = (str) => {
    if (str === "") {
      return;
    }
    const newValue = str;
    setElectrificationScenario(newValue);
    updateControl("electrification_scenario", newValue);
  };

  const handleSiteChange = (str) => {
    if (str === "") {
      return;
    }
    const newValue = str;
    setSite(newValue);
    updateControl("site", newValue);
  };

  const handleIncentivesChange = (checked) => {
    const newValue = checked;
    setIncentives(newValue);
    updateControl("incentives", newValue);
    // Call additional function here
  };

  const handleIraIncentivesChange = (checked) => {
    const newValue = checked;
    setIraIncentives(newValue);
    updateControl("ira_incentives", newValue);
  };

  return (
    <Card className="fixed z-50 fixed-controls">
      <CardHeader>
        <CardContent>
          <form>
            <div className="flex gap-4">
              <div className="flex flex-col space-y-1.5 max-w-[300px]">
                <Label>Electrification Scenario:</Label>
                <Select
                  value={electrificationScenario}
                  onValueChange={handleElectrificationScenarioChange}
                >
                  <SelectTrigger id="electrification-scenario">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {electrificationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Site to Display</Label>
                <Select value={site} onValueChange={handleSiteChange}>
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5 lg:hidden">
                <Label>Federal Incentives</Label>
                <Switch
                  checked={iraIncentives}
                  onCheckedChange={handleIraIncentivesChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5 lg:hidden">
                <Label>State/Local Incentives</Label>
                <Switch
                  checked={incentives}
                  onCheckedChange={handleIncentivesChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default FixedControls;
