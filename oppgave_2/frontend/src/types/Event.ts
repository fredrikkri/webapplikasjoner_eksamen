import { Rules } from './Rules';

export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number;
    available_slots: number;
    price: number;
    rules?: Rules;
    template_id?: number;
}
