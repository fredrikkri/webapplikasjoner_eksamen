import { z } from 'zod';

// SRC: kilde: chatgpt.com /
export const RegistrationSchema = z.object({
    id: z.string(),
    event_id: z.string(),
    email: z.string(),
    has_paid: z.string(),
    registration_date: z.string(),
    order_id: z.string(),
    number_of_people: z.number(),
    responsible_person: z.string()
  });
 
  export const RegistrationCreateSchema = RegistrationSchema.omit( {
    number_of_people: true, responsible_person: true
  })

  export const RegistrationEvent = RegistrationSchema.omit( {
    number_of_people: true, responsible_person: true
  })

export const RegistrationArraySchema = z.array(RegistrationSchema);
export type CreateRegistration = z.infer<typeof RegistrationCreateSchema>;
export type RegistrationEvent = z.infer<typeof RegistrationEvent>;
export type Registration = z.infer<typeof RegistrationSchema>

export const validateCreateRegistration = (data: unknown) => {
    return RegistrationCreateSchema.safeParse(data);
  };