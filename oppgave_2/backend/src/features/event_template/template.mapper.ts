import { Event } from "../../types/event";
import { Template } from "../../types/template";
import { createId } from "../../util/utils";

export const createTemplateResponse = (template: any): Event => {
    return {
        id: template.id,
        title: template.title,
        description: template.description,
        slug: template.slug,
        date: new Date(template.date),
        location: template.location,
        event_type: template.event_type,
        total_slots: template.total_slots,
        available_slots: template.available_slots,
        price: template.price,
      };
};

  
export const fromDb = (event: Template) => {
    return {
      id: event.id ?? createId(),  
      title: event?.event_id ?? "N/A",
    };
};
  

export const createTemplate = (event: Partial<Template>): Template => {
    return {
        id: event.id ?? createId(),  
        event_id: event?.event_id ?? ""
    };
};
  
export const toDb = (data: Partial<Template>) => {
  const event = createTemplate(data); 
  return {
    id: event.id ?? createId(),  
    event_id: event?.event_id ?? ""
    };
};