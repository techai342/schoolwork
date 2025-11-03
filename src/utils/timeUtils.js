export function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(" ");
  if (!time || !period) return -1;
  let [hours, minutes] = time.split(":").map(Number);
  if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (period.toLowerCase() === "am" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}
