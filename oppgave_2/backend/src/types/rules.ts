import { z } from 'zod';

export const RulesSchema = z.object({
    event_id: z.string(),
    is_private: z.string(),
    restricted_days: z.string().nullable(),
    allow_multiple_events_same_day: z.string(),
    waitlist: z.string(),
    fixed_price: z.string(),
    fixed_size: z.string(),
    is_free: z.string()
});

export const RulesCreateSchema = RulesSchema;

export type Rules = z.infer<typeof RulesSchema>;
export type RulesCreate = z.infer<typeof RulesCreateSchema>;

export const validateRules = (data: unknown) => {
    return RulesSchema.safeParse(data);
};

export const validateRulesCreate = (data: unknown) => {
    return RulesCreateSchema.safeParse(data);
};
