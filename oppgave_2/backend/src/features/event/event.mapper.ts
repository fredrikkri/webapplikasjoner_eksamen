import { createId } from "../../util/utils";
import type { Event } from "../../types/event";
import type { Rules } from "../../types/rules";

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

export const createEvent = (event: Partial<Event> & { rules: Omit<Rules, 'event_id'> }): Event & { rules: Omit<Rules, 'event_id'> } => {
    const newEvent = {
        id: createId(),
        title: event?.title ?? "", 
        description: event?.description ?? "", 
        slug: event?.slug ?? "", 
        date: event.date ?? "",
        location: event.location ?? "",
        event_type: event.event_type ?? "",
        total_slots: event.total_slots ?? 0,
        available_slots: event.total_slots ?? 0,
        price: event.price ?? 0,
        rules: {
            is_private: event.rules?.is_private ?? "false",
            restricted_days: event.rules?.restricted_days ?? null,
            allow_multiple_events_same_day: event.rules?.allow_multiple_events_same_day ?? "true",
            waitlist: event.rules?.waitlist ?? "true",
            fixed_price: event.rules?.fixed_price ?? "false",
            fixed_size: event.rules?.fixed_size ?? "false",
            is_free: event.rules?.is_free ?? "false"
        }
    }
    console.log("Mapped event, createEvent:", newEvent);
    return newEvent;
};

export const toDb = (data: Partial<Event> & { rules: Omit<Rules, 'event_id'> }) => {
    const event = createEvent(data); 
    const newEvent = {
        id: event?.id,  
        title: event?.title, 
        description: event?.description, 
        slug: event?.slug, 
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        event_type: event.event_type,
        total_slots: event.total_slots,
        available_slots: event.available_slots,
        price: event.price,
        rules: {
            is_private: event.rules?.is_private ?? "false",
            restricted_days: event.rules?.restricted_days ?? null,
            allow_multiple_events_same_day: event.rules?.allow_multiple_events_same_day ?? "true",
            waitlist: event.rules?.waitlist ?? "true",
            fixed_price: event.rules?.fixed_price ?? "false",
            fixed_size: event.rules?.fixed_size ?? "false",
            is_free: event.rules?.is_free ?? "false"
        }
    }
    console.log("Mapped event, toDb:", newEvent);
    return newEvent;
};
