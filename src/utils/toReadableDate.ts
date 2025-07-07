const toReadableDate = (arr: number[]) => {
  if (!Array.isArray(arr) || arr.length < 6) return "Invalid Date";
  
  const [year, month, day, hour, minute, second] = arr;
  
  // JS months are 0-based (January = 0)
  const date = new Date(year, month - 1, day, hour, minute, second);
  
 return date.toLocaleString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};


export default toReadableDate;