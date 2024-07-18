import useProForma from "../../store/useProForma";
import useCache from "../../store/useCache";

export const useUpdateAdvancedControl = () => {
  const { fetchAndUpdateFleet } = useProForma();
  const { updateAdvancedControls } = useCache();

  const updateAdvancedControl = async (id, updatePayload, setAdvancedCalcs) => {
    try {
      updateAdvancedControls(updatePayload)
      const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/advancedcontrols/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...updatePayload }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update advanced control");
      }

      const data = await response.json();
      // await fetchAndUpdateFleet("advancedControls");
    } catch (error) {
      console.error("Error updating advanced control:", error);
      throw error;
    }
  };

  return updateAdvancedControl;
};
