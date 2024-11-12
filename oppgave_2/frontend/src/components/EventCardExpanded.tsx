import Link from "next/link";

interface EventCardProps {
    title: string;
    description: string;
    date: string | Date;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number; 
    available_slots: number;
    price: number
  }
  
  export default function EventCardExpanded({ title, description, slug, date, location, event_type, total_slots, available_slots, price}: EventCardProps) {
    return (
      <div style={{ padding: '8px', margin: '25px 0', borderRadius: '18px' }}>
        <h2>{title}</h2>
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
            <strong>Event category:</strong> {event_type}
        </p>
        <p>
            <strong>Total slots:</strong> {total_slots}
        </p>
        <p>
            <strong>Available slots:</strong> {available_slots}
        </p>
        <p>
            <strong>Price:</strong> {price}
        </p>
        <Link href={`/events/${slug}`}>
      <button className="px-3 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition my-4 mx-1">
        Meld meg på
      </button>
    </Link>
      </div>
    );
  }
  