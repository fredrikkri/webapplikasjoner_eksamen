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
