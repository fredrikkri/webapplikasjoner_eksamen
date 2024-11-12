import React, { useState, useEffect } from 'react';
import { useAllEvents } from '@/hooks/useEvent';
import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  event_type: string;
  total_slots: number;
  available_slots: number;
  price: number;
}

const Events = () => {
  const { events, loading, error } = useAllEvents(); 
  const [data, setData] = useState<Event[]>([]);

  useEffect(() => {
    if (events && events.length) {
      setData(events);
    }
  }, [events]);

  if (loading) return <div>Laster arrangementer...</div>;
  if (error) return <div>Det oppstod en feil ved henting av eventer.</div>;

  return (
    <div>
      <h1>Alle arrangementer</h1>
      <div>
        {data.length > 0 ? (
          data.map((event) => (
            <EventCard title={event.title} description={event.description} date={event.date} location={event.location} slug={event.slug}/>
          ))
        ) : (
          <p>Ingen tilgjengelige arrangementer.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
