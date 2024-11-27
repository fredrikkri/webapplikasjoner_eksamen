import { Registration } from "../../types/registration";
import { createId } from "../../util/utils";

export const createWaitlistRegistrationResponse = (data: Registration): Registration => {
    const { id, event_id, email, has_paid, registration_date, order_id } = data;
      
    return {
      ...data,
      id,
      event_id,
      email,
      has_paid,
      registration_date,
      order_id
      };
  };

  export const createWaitlistRegistration = (data: Partial<Registration>): Registration => {
    return {
      id: createId(),
      event_id: data.event_id ?? "N/A",
      email: data.email ?? "unknown",
      has_paid: data.has_paid ?? "false",
      registration_date: new Date().toISOString(),
      order_id: data.order_id ?? "Unknown order"
    };
  };
  
  export const fromDb = (data: Registration) => {
    const newRegistration: Registration = {
      id: createId(),
      event_id: data.event_id ?? "N/A",
      email: data.email ?? "unknown",
      has_paid: data.has_paid ?? "false",
      registration_date: new Date().toISOString(),
      order_id: data.order_id ?? "Unknown order"
    };
    console.log("Created registration:", newRegistration);
  return newRegistration;
  };

  export const toDb = (data: Partial<Registration>) => {
    const regdata = createWaitlistRegistration(data);
  
    console.log("Data to insert into DB:", regdata); 
    
    return {
      id: regdata?.id ?? "undefined id",
      event_id: regdata.event_id ?? "undefined event_id",
      email: regdata.email ?? "unknown",
      has_paid: regdata.has_paid.toString() ?? "false",
      registration_date: regdata.registration_date ?? new Date().toISOString(),
      order_id: regdata.order_id ?? "Unknown order"
    };
  };