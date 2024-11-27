import { ActiveEvents } from "@/types/activeEvents";
import { Event } from "../../types/event";
import { createId } from "../../util/utils";

export const createActiveEventResponse = (template: any): Event => {
    return {
        id: template.id,
        title: template.title,
        description: template.description,
        slug: template.slug,
        date: template.date,
        location: template.location,
        event_type: template.event_type,
        total_slots: template.total_slots,
        available_slots: template.available_slots,
        price: template.price,
      };
};

  
export const fromDb = (event: ActiveEvents) => {
    return {
      id: event.id ?? createId(),  
      title: event?.event_id ?? "N/A",
    };
};
  

export const createActiveEvent = (event: Partial<ActiveEvents>): ActiveEvents => {
    return {
        id: event.id ?? "",  
        event_id: event?.event_id ?? ""
    };
};
  
export const toDb = (data: Partial<ActiveEvents>) => {
  const event = createActiveEvent(data); 
  return {
    event_id: event.event_id
    };
};