export type Rules = {
    event_id?: string;
    is_private: string;
    restricted_days: string | null;
    allow_multiple_events_same_day: string;
    waitlist: string;
}
