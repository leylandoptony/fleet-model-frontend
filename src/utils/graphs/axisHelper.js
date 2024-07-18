

export const axisHelper = (min,max,ticks) =>{
    if (!max){
        return []
    }
    const range = max - min
    const step = range/(ticks-1);
    const tickValues = [];
    for (let i = 0; i < ticks; i++) {
        tickValues.push(min + i * step);
    }
    return tickValues;
}


