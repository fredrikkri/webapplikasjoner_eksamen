import { ENDPOINTS } from "@/config/config";
import { Event } from "../../types/Event";
import { getRulesByEventId } from "./rules";

export const getEvent = async (slug: string): Promise<Event | undefined> => {
  const response = await fetch(ENDPOINTS.events + `/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  const result = await response.json();
  
  // Check if the result has success property
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch event");
  }

  const e = result.data as Event;

  try {
    const rules = await getRulesByEventId(e.id);
    if (rules) {
      e.rules = rules;
    }
  } catch (error) {
    console.error(`Failed to fetch rules for event ${e.id}:`, error);
  }

  return e;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await fetch(ENDPOINTS.events);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch events");
  }

  const eve = result.data as Event[];
  const eventWithRules = await Promise.all(
    eve.map(async (e) => {
      try {
        const rules = await getRulesByEventId(e.id);
        if (rules) {
          e.rules = rules;
        }
      } catch (error) {
        console.error(`Failed to fetch rules for template ${e.id}:`, error);
      }
      return e;
    })
  );
  return eventWithRules;
};

export const createEvent = async (data: Omit<Event, 'id'> & { rules: any }): Promise<{ success: boolean; data?: any; error?: { message: string } }> => {
  console.log("current event", data)
  try {
    const response = await fetch(ENDPOINTS.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message || "Kunne ikke opprette arrangement"
        }
      };
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: {
        message: "Feil ved opprettelse av arrangement"
      }
    };
  }
};
