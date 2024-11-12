import { createId } from "../../util/utils";
import type { Event } from "../../types/event";

export const createEventResponse = (event: Event): Event => {
    const { id, title, description, slug, date, location, event_type, total_slots, available_slots, price} = event;
    return {...event, title, description, slug, date, location, event_type, total_slots, available_slots, price};
  };
  
  
  export const fromDb = (event: Event) => {
    return {
      id: event.id ?? createId(),  
      title: event?.title ?? "", 
      description: event?.description ?? "", 
      slug: event?.slug ?? "", 
      date: event.date ?? new Date(),
      location: event.location ?? "",
      event_type: event.event_type ?? "",
      total_slots: event.total_slots ?? 0,
      available_slots: event.available_slots ?? 10,
      price: event.price ?? 0,
    };
  };
  
  export const createEvent = (event: Partial<Event>): Event => {
    return {
        id: event.id ?? createId(),  
        title: event?.title ?? "", 
        description: event?.description ?? "", 
        slug: event?.slug ?? "", 
        date: event.date ?? new Date(),
        location: event.location ?? "",
        event_type: event.event_type ?? "",
        total_slots: event.total_slots ?? 0,
        available_slots: event.available_slots ?? 10,
        price: event.price ?? 0,
    };
  };
  
export const toDb = (data: Partial<Event>) => {
  const event = createEvent(data); 
  return {
    id: event.id ?? createId(),  
    title: event?.title ?? "", 
    description: event?.description ?? "", 
    slug: event?.slug ?? "", 
    date: event.date ?? "",
    location: event.location ?? "",
    event_type: event.event_type ?? "",
    total_slots: event.total_slots ?? "",
    avalible_slots: event.available_slots ?? "",
    price: event.price ?? "",
    };
};