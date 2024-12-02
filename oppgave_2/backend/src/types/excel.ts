export type Event = {
  title: string;
  location: string;
};

export type RegistrationWithEventByYear = {
  id: string;
  event_id: string;
  event_title: string;
  event_location: string;
  email: string;
  has_paid: string;
  registration_date: string;
  order_id: string;
};
