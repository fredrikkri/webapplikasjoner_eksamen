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

interface EventsProps {
  selectedMonth?: number | null;
  selectedYear?: number | null;
}

const Events: React.FC<EventsProps> = ({ selectedMonth, selectedYear }) => {
  const { events, loading, error } = useAllEvents(); 
  const [data, setData] = useState<Event[]>([]);

  // SRC: kilde: chatgpt.com  / med endringer
  useEffect(() => {
    if (events && events.length) {
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return false;

        if (selectedMonth !== null && selectedYear !== null) {
          return (
            eventDate.getMonth() === selectedMonth &&
            eventDate.getFullYear() === selectedYear
          );
        } else if (selectedMonth !== null) {
          return eventDate.getMonth() === selectedMonth;
        } else if (selectedYear !== null) {
          return eventDate.getFullYear() === selectedYear;
        }
        return true;
      });

      setData(filteredEvents);
    }
  }, [events, selectedMonth, selectedYear]);

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold animate-pulse">Laster arrangementer...</div>;
  if (error) return <div>Det oppstod en feil ved henting av eventer.</div>;

  return (
    <div>
      <div>
        {data.length > 0 ? (
          data.map((event) => (
            <EventCard 
              key={event.id}
              title={event.title} 
              description={event.description} 
              date={event.date} 
              location={event.location} 
              slug={event.slug}
              event_type={event.event_type}
            />
          ))
        ) : (
          <p>Ingen tilgjengelige arrangementer for valgt filter.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
