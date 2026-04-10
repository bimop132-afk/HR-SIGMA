import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from "date-fns";

/**
 * Calculates tenure from a start date to an end date (defaulting to now).
 * Returns a human-readable string like "2 thn 5 bln" or "8 bln".
 */
export function calculateTenure(startDate: Date | string, endDate?: Date | string | null): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = endDate 
    ? (typeof endDate === "string" ? new Date(endDate) : endDate)
    : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";

  const years = differenceInYears(end, start);
  const startAfterYears = addYears(start, years);
  const months = differenceInMonths(end, startAfterYears);
  
  const parts = [];
  if (years > 0) parts.push(`${years} thn`);
  if (months > 0 || years === 0) parts.push(`${months} bln`);

  return parts.join(" ") || "0 bln";
}
