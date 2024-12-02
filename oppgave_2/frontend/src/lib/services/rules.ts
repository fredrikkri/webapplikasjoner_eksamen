import { ENDPOINTS } from "../../config/config";
import { Rules } from "../../types/Rules";

export const getRulesByEventId = async (eventId: string): Promise<Rules | undefined> => {
  const response = await fetch(ENDPOINTS.rules(eventId));
  if (!response.ok) {
    throw new Error("Failed to fetch rules");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch rules");
  }

  return result.data as Rules;
};

type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | -1;

export const applyRules = (rules: Rules) => {
  const shouldDisablePrice = rules.fixed_price === "true" || rules.is_free === "true";
  const shouldDisableSize = rules.fixed_size === "true";
  const priceValue = rules.is_free === "true" ? 0 : undefined;

  const allowedDays = rules.restricted_days
    ? rules.restricted_days.split(',').map(day => {
        switch (day.trim()) {
          case 'Mandag': return 1 as DayNumber;
          case 'Tirsdag': return 2 as DayNumber;
          case 'Onsdag': return 3 as DayNumber;
          case 'Torsdag': return 4 as DayNumber;
          case 'Fredag': return 5 as DayNumber;
          case 'Lørdag': return 6 as DayNumber;
          case 'Søndag': return 0 as DayNumber;
          default: return -1 as DayNumber;
        }
      })
    : null;

  const isDateAllowed = (date: Date): boolean => {
    if (!rules.restricted_days || !allowedDays || allowedDays.length === 0) return true;
    
    const dayOfWeek = date.getDay() as DayNumber;
    return allowedDays.includes(dayOfWeek);
  };

  return {
    shouldDisablePrice,
    shouldDisableSize,
    priceValue,
    isDateAllowed,
  };
};
