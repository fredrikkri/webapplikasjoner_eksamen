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
  
  export const EventCreateSchema = EventSchema.omit( {
    id: true, available_slots: true
  })

  export const EventUpdateSchema = EventSchema.omit( {
    id: true
  })

  export type Event = z.infer<typeof EventSchema>
  export type EventCreate = z.infer<typeof EventCreateSchema>
  export type EventUpdate = z.infer<typeof EventUpdateSchema>
  export type EventResponse = z.infer<typeof EventSchema>

  export const validateEvent = (data: unknown) => {
    return EventSchema.safeParse(data);
  };

  export const validateEventCreate = (data: unknown) => {
    return EventCreateSchema.safeParse(data);
  };

  export const validateEventUpdate = (data: unknown) => {
    return EventUpdateSchema.safeParse(data);
  };