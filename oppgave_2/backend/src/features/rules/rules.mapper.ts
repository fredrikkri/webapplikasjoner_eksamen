import type { Rules } from "../../types/rules";

export const fromDb = (rules: Rules): Rules => {
    return {
        event_id: rules.event_id,
        is_private: rules.is_private ?? "false",
        restricted_days: rules.restricted_days ?? null,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day ?? "true",
        waitlist: rules.waitlist ?? "false",
        fixed_price: rules.fixed_price ?? "false",
        fixed_size: rules.fixed_size ?? "false",
        is_free: rules.is_free ?? "false"
    };
};

export const createRulesResponse = (rules: Rules): Rules => {
    return {
        event_id: rules.event_id,
        is_private: rules.is_private,
        restricted_days: rules.restricted_days,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day,
        waitlist: rules.waitlist,
        fixed_price: rules.fixed_price,
        fixed_size: rules.fixed_size,
        is_free: rules.is_free
    };
};

export const toDb = (eventId: string, rules: Omit<Rules, 'event_id'>): Rules => {
    return {
        event_id: eventId,
        is_private: rules.is_private,
        restricted_days: rules.restricted_days,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day,
        waitlist: rules.waitlist,
        fixed_price: rules.fixed_price,
        fixed_size: rules.fixed_size,
        is_free: rules.is_free
    };
};
