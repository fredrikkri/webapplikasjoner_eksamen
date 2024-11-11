import { z } from 'zod';

export const DaysSchema = z.object({
    id: z.string(),
    day: z.string()
})

export type Days = z.infer<typeof DaysSchema>

export const validateEvent = (data: unknown) => {
    return DaysSchema.safeParse(data);
};
