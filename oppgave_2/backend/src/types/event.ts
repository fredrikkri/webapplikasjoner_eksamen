import { parseDate } from '../util/utils';
import { z } from 'zod';
import { RulesSchema } from './rules';

export const EventSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    location: z.string(),
    slug: z.string(),
    event_type: z.string(),
    total_slots: z.number(),
    available_slots: z.number(),
    price: z.number()
});

export const EventWithRulesSchema = EventSchema.extend({
    rules: RulesSchema
});

export const EventCreateSchema = EventSchema.omit({
    available_slots: true
}).extend({
    rules: RulesSchema.omit({ event_id: true })
});

export const EventUpdateSchema = EventSchema.omit({
    id: true
});

export type Event = z.infer<typeof EventSchema>;
export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;
export type EventResponse = z.infer<typeof EventSchema>;
export type EventWithRules = z.infer<typeof EventWithRulesSchema>;

export const validateEvent = (data: unknown) => {
    return EventSchema.safeParse(parseDate(data));
};

export const validateEventCreate = (data: unknown) => {
    return EventCreateSchema.safeParse(parseDate(data));
};

export const validateEventUpdate = (data: unknown) => {
    return EventUpdateSchema.safeParse(parseDate(data));
};

export const validateEventWithRules = (data: unknown) => {
    return EventWithRulesSchema.safeParse(parseDate(data));
};
