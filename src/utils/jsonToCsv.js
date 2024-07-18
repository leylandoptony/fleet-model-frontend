// utils/jsonToCsv.js
export const jsonToCsv = (json) => {
    const items = json;
    if (items.length === 0) return '';
  
    const replacer = (key, value) => (value === null ? '' : value); // handle null values
    const header = Object.keys(items[0]);
  
    const csv = [
      header.join(','), // header row first
      ...items.map((row) =>
        header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
      ),
    ];
  
    return csv.join('\r\n');
  };