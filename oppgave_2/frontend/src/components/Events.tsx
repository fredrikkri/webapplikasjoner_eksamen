import React, { useState, useEffect } from 'react';
import { Event as EventType } from "../types/Event";
import { dummyEvents } from '@/data/data';

const Events = () => {
  const [events, setEvents] = useState<EventType[]>(dummyEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/events');
        const result = await response.json();
        setEvents(result.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <h1>Alle eventer</h1>
      <div>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Dato:</strong> {new Date(event.date).toISOString()}</p>
              <p><strong>Lokasjon:</strong> {event.location}</p>
              <button onClick={() => alert(`Påmelding for ${event.title}`)}>
                Meld deg på
              </button>
            </div>
          ))
        ) : (
          <p>Ingen tilgjengelig arrangementer.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
