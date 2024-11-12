export type Event = {
    id: string;
    title: string;
    description: string;
    slug: string;
    date: Date;
    location: string;
    event_type: string;
    total_slots: number;
    available_slots: number;
    price: number;
}