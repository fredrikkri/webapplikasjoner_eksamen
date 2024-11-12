import Link from "next/link";

interface EventCardProps {
    title: string;
    description: string;
    date: string | Date;
    location: string;
    slug: string;
  }
  
  export default function EventCard({ title, description, date, location, slug }: EventCardProps) {
    return (
      <div style={{ border: '1px solid #cce', padding: '18px', margin: '25px 0', borderRadius: '18px' }}>
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
        <Link href={`/events/${slug}`}>
      <button className="px-3 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition my-4 mx-1">
        Gå til arrangement
      </button>
    </Link>
      </div>
    );
  }
  