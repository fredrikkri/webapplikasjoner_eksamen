import { useEvent } from '@/hooks/useEvent';
import EventCardExpanded from './EventCardExpanded';

interface EventProps {
  slug?: string;
}

function SingleEvent({ slug = "" }: EventProps) {
  const { event, loading, error } = useEvent(slug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-teal-600">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-lg font-medium">Laster arrangement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-red-800 mb-2">Ops! Noe gikk galt</p>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border-2 border-teal-100 bg-teal-50 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-teal-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-teal-900">Fant ikke arrangementet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-900 mb-2">Arrangement</h1>
        <p className="text-teal-600">Se detaljer og meld deg på arrangementet</p>
      </div>
      
      <EventCardExpanded 
      id={event.id}
        title={event.title} 
        description={event.description} 
        slug={event.slug}
        date={event.date} 
        location={event.location} 
        event_type={event.event_type}
        total_slots={event.total_slots}
        available_slots={event.available_slots}
        price={event.price}
        rules={event.rules}
      />
    </div>
  );
}

export default SingleEvent;
