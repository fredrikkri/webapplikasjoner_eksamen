import { BASE_URL, ENDPOINTS } from "@/config/config";
// import { events } from "../../data/data";

export interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  event_type: string;
  total_slots: string;
  available_slots: number;
  price: number;
}

export const getEvent = async (id: string): Promise<Event | undefined> => {
  const response = await fetch(ENDPOINTS.events + `/${id}`);
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
