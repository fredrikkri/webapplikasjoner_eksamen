export type Event = {
    title: string;
    description: string;
    date: string | Date;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number;
    available_slots: number;
    price: number;
}