import React, { forwardRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect } from "react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import useAdvancedCalc from "../../store/useAdvancedCalc";
import ControlLabel from "./ControlLabel";
import { NumericFormat } from "react-number-format";
import useAuthStore from "../../store/useAuthStore";
import { useUpdateAdvancedControl } from "./advUtils";
import useProForma from "../../store/useProForma";

const Economics = forwardRef((props, ref) => {
  const updateAdvancedControl = useUpdateAdvancedControl();
  const {advancedControls } = useProForma();
  
  const { setAdvancedCalcs } = useAdvancedCalc();
  const { user } = useAuthStore();
  const [loaded, setLoaded] = useState(false);
  const [formState, setFormState] = useState({
    inflation: false,
    inflation_escalation_rate: "",
    electricity_escalation_rate: "",
    gasoline_escalation_rate: "",
    infrastructure_loan_term: "",
    infrastructure_loan_interest_rate: "",
    discount_rate_npv: "",
    maintenance_costs_annual_per_station: "",
  });

  useEffect(() => {
    if (advancedControls) {
      if (advancedControls?.id) {
        setLoaded(true);
      }

      setFormState((prevState) => {
        const newState = {
          inflation: advancedControls.inflation ?? false,
          inflation_escalation_rate:
          advancedControls.inflation_escalation_rate ?? "",
          electricity_escalation_rate:
          advancedControls.electricity_escalation_rate ?? "",
          gasoline_escalation_rate:
          advancedControls.gasoline_escalation_rate ?? "",
          infrastructure_loan_term:
          advancedControls.infrastructure_loan_term ?? "",
          infrastructure_loan_interest_rate:
          advancedControls.infrastructure_loan_interest_rate ?? "",
          discount_rate_npv: advancedControls.discount_rate_npv ?? "",
          maintenance_costs_annual_per_station:
          advancedControls.maintenance_costs_annual_per_station ?? "",
        };

        // Only update state if there's a difference
        if (JSON.stringify(newState) !== JSON.stringify(prevState)) {
          return newState;
        } else {
          return prevState;
        }
      });
    }
  }, [advancedControls]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    try {
      let val = value;
      if (val.endsWith("%")) {
        val = val.slice(0, -1);
      }
      await updateAdvancedControl(user.id, { [name]: val },setAdvancedCalcs);
    } catch (error) {
      // Handle the error if needed
    }
  };

  const handleChange1 = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const handleSwitchChange = async (checked) => {
    setFormState((prevState) => ({
      ...prevState,
      inflation: checked,
    }));

    try {
      await updateAdvancedControl(user.id, { inflation: checked },setAdvancedCalcs);
    } catch (error) {
      // Handle the error if needed
      console.error("Error updating advanced control:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Economic Controls</CardTitle>
        <CardDescription>
          Adjust economic and financial assumptions
        </CardDescription>{" "}
      </CardHeader>
      <CardContent className="w-2/3">
        <form ref={ref} onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <ControlLabel text="Inflation" info="Toggles inflation" />
              <Switch
                checked={formState.inflation}
                onCheckedChange={handleSwitchChange}
              />
              <input
                type="hidden"
                name="inflation"
                value={formState.inflation ? "true" : "false"}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex">
                <ControlLabel
                  text="Inflation Escalation Rate"
                  info="Controls the escalation rate of inflation for EV purchase cost, Default Replacement Allocation, and Annual Maintenance Costs "
                />
              </div>
              <NumericFormat
                customInput={Input}
                variant="blank"
                name="inflation_escalation_rate"
                value={formState.inflation_escalation_rate}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "inflation_escalation_rate",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                suffix="%"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 100)
                  );
                }}
                placeholder="%"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Electricity Escalation Rate"
                info="Controls the escalation rate of inflation for EV Annual Charging Costs"
              />
              <NumericFormat
                customInput={Input}
                variant="blank"
                name="electricity_escalation_rate"
                value={formState.electricity_escalation_rate}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "electricity_escalation_rate",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                suffix="%"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 100)
                  );
                }}
                placeholder="%"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Gasoline Escalation Rate"
                info="Controls the escalation rate of inflation for Existing Vehicle Annual Fuel Costs"
              />
              <NumericFormat
                customInput={Input}
                variant="blank"
                name="gasoline_escalation_rate"
                value={formState.gasoline_escalation_rate}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "gasoline_escalation_rate",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                suffix="%"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 100)
                  );
                }}
                placeholder="%"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Infrastructure Loan Term (yrs)"
                info="Controls the length of of the loan term"
              />
              <Input
                variant="blank"
                name="infrastructure_loan_term"
                value={formState.infrastructure_loan_term}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "infrastructure_loan_term",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                onChange={handleChange1}
                type="text"
                placeholder=""
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Infrastructure Loan Interest Rate"
                info="Controls the interest rate of the loan"
              />
              <NumericFormat
                customInput={Input}
                variant="blank"
                name="infrastructure_loan_interest_rate"
                value={formState.infrastructure_loan_interest_rate}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "infrastructure_loan_interest_rate",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                suffix="%"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 100)
                  );
                }}
                placeholder="%"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Discount Rate  (NPV)"
                info="Controls discount rate for calculating the Net Present Value (NPV)"
              />
              <NumericFormat
                customInput={Input}
                variant="blank"
                name="discount_rate_npv"
                value={formState.discount_rate_npv}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "discount_rate_npv",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }

                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                suffix="%"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 100)
                  );
                }}
                placeholder="%"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <ControlLabel
                text="Charger Maintenance Costs  ($/yr)"
                info="Cost of maintenance, annual per station"
              />
              <Input
                variant="blank"
                name="maintenance_costs_annual_per_station"
                value={formState.maintenance_costs_annual_per_station}
                onBlur={(e) =>
                  handleChange({
                    target: {
                      name: "maintenance_costs_annual_per_station",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }
                onChange={handleChange1}
                type="text"
                placeholder=""
              />
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
});

Economics.displayName = "Economics";

export default Economics;
