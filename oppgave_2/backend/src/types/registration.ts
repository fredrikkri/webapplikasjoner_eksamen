import { z } from 'zod';

// SRC: kilde: chatgpt.com /
export const RegistrationSchema = z.object({
    id: z.string(),
    event_id: z.string(),
    email: z.string(),
    had_paid: z.string(),
    registration_date: z.date()
  });

export const RegistrationCreateSchema = RegistrationSchema.omit({ 
    id: true, 
    registration_date: true, 
    event_id: true 
});

export const RegistrationArraySchema = z.array(RegistrationSchema);
export type CreateRegistration = z.infer<typeof RegistrationCreateSchema>;
export type Registration = z.infer<typeof RegistrationSchema>

export const validateCreateComment = (data: unknown) => {
    return RegistrationCreateSchema.safeParse(data);
  };