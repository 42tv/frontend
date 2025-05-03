// Helper function to format elapsed time as HH:MM
export const formatElapsedTime = (startTime: string | null): string => {
  if (!startTime) return "00:00"; // Handle null or undefined start time
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  // Handle cases where start time might be in the future slightly due to clock differences
  if (diffMs < 0) return "00:00";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format hours and minutes to always have two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};
