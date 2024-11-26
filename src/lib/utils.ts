import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDateRange = (frequency) => {
  const endDate = new Date(); // Today
  const startDate = new Date();

  switch (frequency) {
    case "1d":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "1w":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "1y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      break;
  }

  return {
    startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
  };
};
