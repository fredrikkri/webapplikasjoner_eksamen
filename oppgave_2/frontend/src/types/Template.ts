export type Template = {
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
}

export type TemplateBase = {
    id: string;
    event_id: string;
  }