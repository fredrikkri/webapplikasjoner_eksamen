import { ENDPOINTS } from "@/config/config";
import { Event } from "../../types/Event";
import { getRulesByEventId } from "./rules";

// SRC: kilde: chatgpt.com  / metode under er laget med gpt. Det er gjort nødvendige endringer for å tilpasse den til vårt prosjekt.
export const getEvent = async (slug: string): Promise<Event | undefined> => {
  const response = await fetch(ENDPOINTS.events + `/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  const result = await response.json();
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
}

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(`${ENDPOINTS.deleteEvent(eventId)}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error, could not delete event:", error);
    throw error;
  }
}

export const editEvent = async (eventData: Event): Promise<void> => {
  try {
    const response = await fetch(`${ENDPOINTS.editEvent(eventData)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
      
    });
  
    if (!response.ok) {
      throw new Error(`Failed to edit event: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error, could not edit event:", error);
    throw error;
  }
};

export const updateAvailableSlots = async (event_id: string, available_slots: number): Promise<void> => {
  try {
    // Prepare the request body with the available slots data
    const bodyData = {
      available_slots,  // Include the available_slots in the request body
    };

    const response = await fetch(`${ENDPOINTS.updateEventAvailableSlots(event_id, available_slots.toString())}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(bodyData),  // Send bodyData in the request
    });

    // Handle unsuccessful response
    if (!response.ok) {
      throw new Error(`Failed to update available slots: ${response.statusText}`);
    }

    // If successful, you can add any further success handling here if needed
  } catch (error) {
    console.error("Error, could not update available slots:", error);
    throw error;  // Re-throw the error to handle it in the calling function
  }
};
