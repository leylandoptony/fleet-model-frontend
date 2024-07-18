import useAuthStore from "../store/useAuthStore";

export const patchCityInfo = async (data) => {
    const { user } = useAuthStore.getState();
    if(!user){
        return;
    }
  const response = await fetch(`${process.env.REACT_APP_API_ROUTE}api/city-info/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return responseData;
};


export const fetchCityInfo = async () => {
  try {
    const { user } = useAuthStore.getState();
    if (!user) return;
    const response = await fetch(
        `${process.env.REACT_APP_API_ROUTE}api/city-info/${user.id}`
    );
    const data = await response.json();
    return data
} catch (error) {
    console.error("Error fetching city info:", error);
}
}