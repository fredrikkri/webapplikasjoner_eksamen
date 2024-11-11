import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    date: z.date(),
    location: z.string(),
    event_type: z.string(),
    total_slots: z.number(),
    available_slots: z.number(),
    price: z.number()
  })
  
  export type Event = z.infer<typeof EventSchema>

  export const validateEvent = (data: unknown) => {
    return EventSchema.safeParse(data);
  };