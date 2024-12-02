import { Event } from "../../types/event";
import { createId } from "../../util/utils";

export const createTemplateResponse = (template: any): Event & { template_id?: number } => {
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
        template_id: template.template_id
    };
};

export const fromDb = (event: any) => {
    return {
        id: event.id ?? createId(),  
        event_id: event.event_id,
        template_id: event.template_id
    };
};

export const createTemplate = (event: any) => {
    return {
        id: event.id ?? createId(),  
        event_id: event.event_id,
        template_id: event.template_id
    };
};

export const toDb = (data: any) => {
    const event = createTemplate(data); 
    return {
        event_id: event.event_id,
        template_id: event.template_id
    };
};
