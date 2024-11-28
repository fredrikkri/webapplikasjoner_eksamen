import Link from "next/link";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  slug: string;
  event_type: string;
  total_slots: number;
  available_slots: number;
}

export default function EventCard({ 
  title, 
  description, 
  date, 
  location, 
  slug, 
  event_type, 
  total_slots, 
  available_slots 
}: EventCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 min-h-[4.5rem] line-clamp-3">{title}</h2>
            <span className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700 rounded-full shrink-0">
              {event_type}
            </span>
          </div>
          <p className="text-slate-600 line-clamp-3">{description}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-3 flex-grow">
          <div className="flex items-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(date).toLocaleDateString('no-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>

        {/* Availability Status */}
        <div className="mt-4">
          {available_slots > 0 ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {available_slots} ledige plasser
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ingen ledige plasser
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 pt-0 mt-auto">
        <Link href={`/events/${slug}`} className="block">
          <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200">
            <span>Gå til arrangement</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Link>
      </div>
    </article>
  );
}
