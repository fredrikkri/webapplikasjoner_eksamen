import { ENDPOINTS } from "@/config/config";
import { Event } from "../../types/Event";

export const getEvent = async (slug: string): Promise<Event | undefined> => {
  const response = await fetch(ENDPOINTS.events + `/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch event");
  }

  return result.data as Event;
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

  return result.data as Event[];
};

export const createEvent = async (data: Omit<Event, 'id'> & { rules: any }): Promise<void> => {
  console.log("current event", data)
  try {
    const response = await fetch(ENDPOINTS.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error.message || "Failed to create event");
    }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
