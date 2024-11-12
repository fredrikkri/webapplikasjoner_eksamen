import React, { useState, useEffect } from 'react';
import { useAllEvents } from '@/hooks/useEvent';

interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  event_type: string;
  total_slots: string;
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
            <div key={event.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Dato:</strong> {new Date(event.date).toLocaleDateString('no-NO', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</p>
              <p><strong>Lokasjon:</strong> {event.location}</p>
              <button onClick={() => alert(`Påmelding for ${event.title}`)}>
                Meld deg på
              </button>
            </div>
          ))
        ) : (
          <p>Ingen tilgjengelige eventer.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
