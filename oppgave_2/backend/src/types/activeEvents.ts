import { z } from 'zod';

export const ActiveEventsSchema = z.object({
    id: z.string(),
    event_id: z.string(),
    template_id: z.number().optional()
})

export const ActiveEventsCreate = ActiveEventsSchema.omit({
    id: true,
})

export type ActiveEvents = z.infer<typeof ActiveEventsSchema>
export type ActiveEventsCreate = z.infer<typeof ActiveEventsCreate>

export const validateActiveEvents = (data: unknown) => {
    return ActiveEventsSchema.safeParse(data);
};

export const validateActiveEventsCreate = (data: unknown) => {
    return ActiveEventsCreate.safeParse(data);
};
