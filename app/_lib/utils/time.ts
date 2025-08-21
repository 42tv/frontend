/**
 * Time formatting utilities for live streaming and elapsed time calculations
 */

/**
 * Format elapsed time from start time to now
 * @param startTime - ISO date string or null
 * @param includeSeconds - Whether to include seconds in the format (default: false)
 * @returns Formatted time string in HH:MM or HH:MM:SS format
 */
export const formatElapsedTime = (
  startTime: string | null, 
  includeSeconds: boolean = false
): string => {
  const defaultFormat = includeSeconds ? "00:00:00" : "00:00";
  
  if (!startTime) return defaultFormat;
  
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  // Handle cases where start time might be in the future slightly due to clock differences
  if (diffMs < 0) return defaultFormat;

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format hours and minutes to always have two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  if (includeSeconds) {
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedHours}:${formattedMinutes}`;
};

