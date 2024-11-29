import type { Rules } from "../../types/rules";

export const fromDb = (rules: Rules): Rules => {
    return {
        event_id: rules.event_id,
        is_private: rules.is_private ?? "false",
        restricted_days: rules.restricted_days ?? null,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day ?? "true",
        waitlist: rules.waitlist ?? "false"
    };
};

export const createRulesResponse = (rules: Rules): Rules => {
    return {
        event_id: rules.event_id,
        is_private: rules.is_private,
        restricted_days: rules.restricted_days,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day,
        waitlist: rules.waitlist
    };
};

export const toDb = (eventId: string, rules: Omit<Rules, 'event_id'>): Rules => {
    return {
        event_id: eventId,
        is_private: rules.is_private,
        restricted_days: rules.restricted_days,
        allow_multiple_events_same_day: rules.allow_multiple_events_same_day,
        waitlist: rules.waitlist
    };
};
