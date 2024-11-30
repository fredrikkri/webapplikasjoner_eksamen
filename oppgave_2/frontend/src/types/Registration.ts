export type Registration = {
    id: string;
    event_id: string;
    email: string;
    has_paid: string;
    registration_date: string;
    order_id: string;
    number_of_people: number;
    responsible_person: string;
  }; 

  export type CreateRegistration = {
    id: string;
    event_id: string;
    email: string;
    has_paid: string;
    registration_date: string;
    order_id: string;
  }; 

  export type RegistrationEventData = {
    id: string;
    event_id: string;
    email: string;
    has_paid: string;
    registration_date: string;
    order_id: string;
  }; 