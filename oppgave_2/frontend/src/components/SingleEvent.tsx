import React, { useState, useEffect } from 'react';
import { Event as EventType } from "../types/Event";
import { dummyEvents } from '@/data/data';

interface EventProps {
  slug?: string;
}

const SingleEvent: React.FC<EventProps> = ({ slug = "sommerkonsert" }) => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/v1/events/${slug}`);
        if (!response.ok) {
          throw new Error(`Fant ikke eventet: ${response.statusText}`);
        }

        const result = await response.json();
        setEvent(result.data);
      } catch (error) {
        setError("Kunne ikke hente eventer.");
        console.error("Error fetching this event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <div>Loading event...</div>;

  if (error) return (
    <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error}
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
    <div style={{ border: '1px solid #cce', padding: '18px', margin: '25px 0', borderRadius: '18px' }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Dato:</strong> {new Date(event.date).toISOString()}</p>
      <p><strong>Lokasjon:</strong> {event.location}</p>
      <button onClick={() => alert(`Påmelding for ${event.title}`)}>Meld deg på</button>
    </div>
  );
};

export default SingleEvent;
