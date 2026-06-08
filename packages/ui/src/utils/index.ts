import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the moon phase for a given date.
 * Returns one of: "new", "waxing", "full", "waning"
 */
export function getMoonPhase(date: Date): "new" | "waxing" | "full" | "waning" {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  ++month;
  const c = 365.25 * year;
  const e = 30.6 * month;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const b_trunc = Math.trunc(jd);
  jd -= b_trunc;
  let b = Math.round(jd * 8);

  if (b >= 8) b = 0;

  switch (b) {
    case 0:
      return "new";
    case 1:
    case 2:
    case 3:
      return "waxing";
    case 4:
      return "full";
    case 5:
    case 6:
    case 7:
      return "waning";
    default:
      return "new";
  }
}
