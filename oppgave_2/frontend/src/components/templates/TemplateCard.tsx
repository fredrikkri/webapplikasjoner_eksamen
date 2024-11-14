import Link from "next/link";

type TemplateCardProps = {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    slug: string;
    event_type: string;
  }
  
  export default function TemplateCard({ title, description, date, location, slug, event_type }: TemplateCardProps) {
    return (
    <div className="border border-[#cce] p-4.5 my-6 rounded-[18px]">
      <h2 className="text-2xl font-bold text-gray-800 my-3">{title}</h2>
        <p>{description}</p>
        <p><strong>Category: </strong>{event_type}</p>
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
        <Link href={`/templates/${slug}`}>
      <button type="button" className="px-3 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition my-4 mx-1">
        Gå til mal
      </button>
    </Link>
      </div>
    );
  }
  