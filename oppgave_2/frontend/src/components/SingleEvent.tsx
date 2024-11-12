import React, { useState, useEffect } from 'react';
import { Event as EventType } from "../types/Event";
import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/useEvent';

interface EventProps {
  slug?: string;
}

function SingleEvent({ slug = "sommerkonsert" }: EventProps) {
  const params = useParams();
  const lessonSlug = params?.lessonSlug as string;
 
  const { event, loading, error } = useEvent(slug);

  if (loading) return <div>Laster event...</div>;

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
