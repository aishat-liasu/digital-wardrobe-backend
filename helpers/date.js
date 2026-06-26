import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  parseISO,
} from "date-fns";

export const getDateRange = ({ year, month, weekDate, day }) => {
  // By Day (Specific Date)
  if (day) {
    const date = new Date(day); // e.g., "2026-01-12"
    return {
      start: startOfDay(date),
      end: endOfDay(date),
    };
  }

  // By Week (The week containing a specific date)
  if (weekDate) {
    const date = new Date(weekDate);
    return {
      start: startOfWeek(date, { weekStartsOn: 1 }), // Monday start
      end: endOfWeek(date, { weekStartsOn: 1 }),
    };
  }

  // By Month and Year
  if (month && year) {
    // Month is 0-indexed in JS (0 = Jan), so we subtract 1 if input is 1-12
    const date = new Date(year, month - 1);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  }

  // By Year
  if (year) {
    const date = new Date(year, 0, 1);
    return {
      start: startOfYear(date),
      end: endOfYear(date),
    };
  }

  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};
