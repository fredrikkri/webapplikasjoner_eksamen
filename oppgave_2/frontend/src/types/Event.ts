export type Event = {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number;
    available_slots: number;
    price: number;
}