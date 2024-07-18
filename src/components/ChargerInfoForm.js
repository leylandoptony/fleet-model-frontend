import React,{ useState, useEffect } from "react";
import useProForma from "../store/useProForma";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";



const ChargerInfoForm = () => {
  const { chargerCost:chargerCosts,cityInfo } = useProForma(); // Assuming this fetches the charger data for the current user
  const [formData, setFormData] = useState({
    cost_less_than_10_kw: null,
    cost_10_20_kw: null,
    cost_25_kw: null,
    cost_180_200_kw: null,
    install_less_than_10_kw:null,
    install_10_20_kw:null,
    install_25_kw:null,
    install_180_200_kw:null,
  });

  useEffect(() => {
    if (chargerCosts) {
      setFormData({
        cost_less_than_10_kw: chargerCosts.cost_less_than_10_kw ?? null,
        cost_10_20_kw: chargerCosts.cost_10_20_kw ?? null,
        cost_25_kw: chargerCosts.cost_25_kw ?? null,
        cost_180_200_kw: chargerCosts.cost_180_200_kw ?? null,
        install_less_than_10_kw: chargerCosts.install_less_than_10_kw ?? null,
        install_10_20_kw: chargerCosts.install_10_20_kw ?? null,
        install_25_kw: chargerCosts.install_25_kw ?? null,
        install_180_200_kw: chargerCosts.install_180_200_kw ?? null,
      });
    }
  }, [chargerCosts]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === '' ? null : value,
    }));
  };



  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/chargerdata/patch/${chargerCosts.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <form className="w-1/2" onSubmit={handleSubmit}>
      <div>
        <Label>{"Cost " +(cityInfo?.range_1?cityInfo?.range_1:"< 10 kW")}</Label>
        <Input
          type="number"
          name="cost_less_than_10_kw"
          value={formData.cost_less_than_10_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Cost " +(cityInfo?.range_2?cityInfo?.range_2:"10-20 kW")}</Label>
        <Input
          type="number"
          name="cost_10_20_kw"
          value={formData.cost_10_20_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Cost " +(cityInfo?.range_3?cityInfo?.range_3:"25 kW")}</Label>
        <Input
          type="number"
          name="cost_25_kw"
          value={formData.cost_25_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Cost " +(cityInfo?.range_4?cityInfo?.range_4:"180-200 kW")}</Label>
        <Input
          type="number"
          name="cost_180_200_kw"
          value={formData.cost_180_200_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Install Cost " +(cityInfo?.range_1?cityInfo?.range_1:"< 10 kW")}</Label>
        <Input
          type="number"
          name="install_less_than_10_kw"
          value={formData.install_less_than_10_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Install Cost " +(cityInfo?.range_2?cityInfo?.range_2:"10-20 kW")}</Label>
        <Input
          type="number"
          name="install_10_20_kw"
          value={formData.install_10_20_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Install Cost " +(cityInfo?.range_3?cityInfo?.range_3:"25 kW")}</Label>
        <Input
          type="number"
          name="install_25_kw"
          value={formData.install_25_kw}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>{"Install Cost " +(cityInfo?.range_4?cityInfo?.range_4:"180-200 kW")}</Label>
        <Input
          type="number"
          name="install_180_200_kw"
          value={formData.install_180_200_kw}
          onChange={handleInputChange}
        />
      </div>
      <Button className="mt-4" type="submit">Update</Button>
    </form>
  );
};

export default ChargerInfoForm;
