import Link from "next/link";

type EventCardProps = {
    title: string;
    description: string;
    date: Date;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number; 
    available_slots: number;
    price: number
  }
  
  export default function EventCardExpanded({ title, description, slug, date, location, event_type, total_slots, available_slots, price}: EventCardProps) {
    return (
      <div className="p-2.5 my-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 my-3">{title}</h2>
        <p>{description}</p>
        <p>
          <strong>Dato:</strong> {new Date(date).toLocaleDateString('no-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p>
          <strong>Lokasjon:</strong> {location}
        </p>
        <p>
            <strong>kategori:</strong> {event_type}
        </p>
        <p>
            <strong>Antall plasser:</strong> {total_slots}
        </p>
        <p>
            <strong>Ledige plasser:</strong> {available_slots}
        </p>
        <p>
            <strong>Pris:</strong> {price}
        </p>
        <Link href={`/events/${slug}`}>
      <button type="button" className="my-4 w-1/3 bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
        Meld meg på
      </button>
    </Link>
      </div>
    );
  }
  