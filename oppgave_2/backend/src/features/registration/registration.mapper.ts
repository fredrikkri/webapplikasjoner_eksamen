import { Registration, RegistrationCreateSchema } from "@/types/registration";
import { createId } from "../../util/utils";

export const createRegistrationResponse = (data: Registration): Registration => {
    const { id, event_id, email, has_paid, registration_date } = data;
      
    return {
      ...data,
      id,
      event_id,
      email,
      has_paid,
      registration_date
      };
  };

  export const createRegistration = (data: Partial<Registration>): Registration => {
    return {
        id: data.id ?? createId(),
        event_id: data.event_id ?? "N/A",
        email: data.email ?? "unknown",
        has_paid: data.has_paid ?? "false",
        registration_date: data.registration_date ?? new Date
    };
  };
  
  export const fromDb = (data: Registration) => {
      return {
        id: data.id ?? createId(),
        event_id: data.event_id ?? "N/A",
        email: data.email ?? "unknown",
        has_paid: data.has_paid ?? "false",
        registration_date: data.registration_date ?? "N/A"
      };
  };

  export const toDb = (data: Partial<Registration>) => {
    const regdata = createRegistration(data);
  
    return {
        id: regdata?.id ?? createId(),
        event_id: regdata.event_id ?? null,
        email: regdata.email ?? "unknown",
        has_paid: regdata.has_paid ?? "false",
        registration_date: regdata.registration_date ?? new Date
    };
  };