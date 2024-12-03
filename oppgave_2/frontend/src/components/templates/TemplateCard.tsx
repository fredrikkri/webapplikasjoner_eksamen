import Link from "next/link";

type TemplateCardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  slug: string;
  event_type: string;
}

export default function TemplateCard({ title, description, date, location, slug, event_type }: TemplateCardProps) {
  {/* SRC: kilde: chatgpt.com  || Tailwind laget med gpt */}
  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border-l-4 border-indigo-500">
      <div className="p-6 flex flex-col flex-grow">
        <div className="space-y-2 mb-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-indigo-900 min-h-[4.5rem] line-clamp-3">{title}</h2>
            <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full shrink-0">
              {event_type}
            </span>
          </div>
          <p className="text-slate-600 line-clamp-3">{description}</p>
        </div>
        <div className="space-y-3 flex-grow">
          <div className="flex items-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <Link href={`/templates/${slug}`} className="block">
          <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200">
            <span>Bruk denne malen</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </article>
  );
}
