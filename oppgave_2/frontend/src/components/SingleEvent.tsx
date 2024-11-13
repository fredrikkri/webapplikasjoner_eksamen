import { useEvent } from '@/hooks/useEvent';
import EventCardExpanded from './EventCardExpanded';

interface EventProps {
  slug?: string;
}

function SingleEvent({ slug = "" }: EventProps) {
 
  const { event, loading, error } = useEvent(slug);

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold animate-pulse">Laster arrangementer...</div>;

  if (error) return (
    <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error.message}
      </p>
    </div>
  );

  if (!event) return (
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke arrangementet
      </p>
    </div>
  );

  return (
    <EventCardExpanded 
      title={event.title} 
      description={event.description} 
      slug={event.slug}
      date={event.date} 
      location={event.location} 
      event_type={event.event_type}
      total_slots={event.total_slots}
      available_slots={event.available_slots}
      price={event.price} 
      />
  );
};

export default SingleEvent;
