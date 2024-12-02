import { ActiveEvents } from "../../types/activeEvents";
import { Event } from "../../types/event";
import { createId } from "../../util/utils";

export const createActiveEventResponse = (event: any): Event & { template_id?: number } => {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        slug: event.slug,
        date: event.date,
        location: event.location,
        event_type: event.event_type,
        total_slots: event.total_slots,
        available_slots: event.available_slots,
        price: event.price,
        template_id: event.template_id
    };
};

export const fromDb = (event: ActiveEvents): ActiveEvents => {
    return {
        id: event.id ?? createId(),
        event_id: event.event_id,
        template_id: event.template_id
    };
};

export const createActiveEvent = (event: Partial<ActiveEvents>): ActiveEvents => {
    return {
        id: event.id ?? createId(),
        event_id: event.event_id ?? "",
        template_id: event.template_id
    };
};

export const toDb = (data: Partial<ActiveEvents>) => {
    const event = createActiveEvent(data);
    return {
        event_id: event.event_id,
        template_id: event.template_id !== undefined ? event.template_id : null
    };
};
