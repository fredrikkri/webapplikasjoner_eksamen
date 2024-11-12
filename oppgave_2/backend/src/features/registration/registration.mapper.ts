import { Registration } from "@/types/registration";

export const createCategoryResponse = (data: Registration): Registration => {
    const { id, event_id, email, had_paid, registration_date } = data;
      
    return {
      ...data,
      id,
      event_id,
      email,
      had_paid,
      registration_date
      };
  };
  
  export const fromDb = (data: Registration) => {
      return {
        id: data.id ?? createId(),
        event_id: data.event_id ?? null,
        email: data.email ?? "unknown",
        had_paid: data.had_paid ?? "false",
        registration_date: data.registration_date ?? null
      };
  };