export const getCharger = (cityInfo) => {
    return [
        cityInfo.range_1 || "<10 kw",
        cityInfo.range_2 || "10-20 kW",
        cityInfo.range_3 || "25 kW",
        cityInfo.range_4 || "180-200 kW"
    ];
};

export const getIndivCharger = (cityInfo,index) => {
    const map ={
        1: cityInfo.range_1 || "<10 kw",
        2: cityInfo.range_2 || "10-20 kW",
        3: cityInfo.range_3 || "25 kW",
        4: cityInfo.range_4 || "180-200 kW"
    }
    if (index in map){
        return map[index];
    }
    return "Select Charger"
    
};