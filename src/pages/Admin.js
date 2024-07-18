// src/Signup.js
import React, { useState } from "react";
import supabase from "../supabaseClient";
import { useDropzone } from "react-dropzone";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setCsvFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    const newEmail = email + "@optonyusa.com";
    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password,
    });

    if (error) {
      setMessage(`${error.message}`);
    } else {
      if (csvFile) {
        await uploadCSVFile(data.user.id);
      }
    }
  };

  const uploadCSVFile = async (userId) => {
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}upload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const res = await response.json();
        console.log(res);
        const errorMessage = `CSV format is incorrect.\nServer message: ${res.error}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setMessage(`${result.message}`);

      const defaultControlsData = {
        id: userId,
        electrification_scenario: "",
        site: "",
        incentives: false,
        ira_incentives: false,
      };
      const defaultAdvancedControls = {
        id: userId,
        inflation: false,
        inflation_escalation_rate: 3,
        electricity_escalation_rate: 3,
        gasoline_escalation_rate: 3,
        infrastructure_loan_term: 10,
        infrastructure_loan_interest_rate: 3,
        discount_rate_npv: 3,
        maintenance_costs_annual_per_station: 0,
        charging_optimization: false,
        charging_optimization_savings: 0,
        charge_management_subscription_costs: 0,
        charger_network_costs: 0,
      };

      // Call the /api/controls endpoint with the default data
      const controlsResponse = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/controls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(defaultControlsData),
        }
      );
      const advancedControlRes = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/advancedcontrols/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(defaultAdvancedControls),
        }
      );
      const chargerCostAdd = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/chargerdata/add/${userId}`
      );

      if (
        !controlsResponse.ok ||
        !advancedControlRes.ok ||
        !chargerCostAdd.ok
      ) {
        throw new Error("Failed to set controls data");
      }

      navigate("/");
    } catch (error) {
      setMessage(`Error creating account: ${error.message}`);
      await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="h-[500px] w-[500px] p-4">
        <CardHeader className="pb-5">
          <CardTitle>Pro Forma Account Addition</CardTitle>
          <CardDescription>Add Pro Forma Users Here</CardDescription>
          <p className="text-sm text-red-400">{message}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>New Username</Label>
                <Input
                  type="text"
                  placeholder="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>New Password</Label>
                <Input
                  type="text"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

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

              <div className="flex flex-col space-y-1.5">
                <Button type="submit">Create Account</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
