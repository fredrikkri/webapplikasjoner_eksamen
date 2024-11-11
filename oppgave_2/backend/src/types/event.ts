import { z } from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string()
  })
  
  export type Event = z.infer<typeof EventSchema>

  export const validateCategories = (data: unknown) => {
    return EventSchema.safeParse(data);
  };
  