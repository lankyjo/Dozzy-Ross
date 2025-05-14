export function calculateDuration({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffMs = end.getTime() - start.getTime();

  // Convert to days, hours, minutes
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format the duration string
  const durationParts = [];
  if (days > 0) durationParts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) durationParts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0)
    durationParts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

  return {
    duration: durationParts.join(", "),
    durationMs: diffMs,
  };
}

export function capitalizeFirstLetter(string?: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function customErrorFunc(error: any) {
  console.error("Error:", error);
}

export function customNotification(
  title: string,
  message: string,
  color: string,
  icon?: React.ReactNode
) {
  console.log(`${title}: ${message}`);
}

export function transaformIncomingTourLocation(locations: any[]) {
  return locations.map((location) => ({
    ...location,
    startDate: new Date(location.startDate),
    endDate: new Date(location.endDate),
  }));
}

export function formatTourEventLocations(
  locations: any[],
  eventId: string,
  isEdit: boolean
) {
  return locations.map((location) => ({
    eventId,
    startDate: location.startDate,
    endDate: location.endDate,
    locationType: location.eventLocationType,
    ...location,
  }));
}
