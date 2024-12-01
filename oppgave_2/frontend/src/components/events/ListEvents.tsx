import React, { useState, useEffect } from 'react';
import { useAllEvents } from '@/hooks/useEvent';
import EventCard from './EventCard';
import { Rules } from '@/types/Rules';

interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  location: string;
  event_type: string;
  total_slots: number;
  available_slots: number;
  price: number;
  rules?: Rules;
}

interface EventsProps {
  selectedMonth?: number | null;
  selectedYear?: number | null;
  selectedCategory?: string | null;
}
const ListEvents: React.FC<EventsProps> = ({ selectedMonth, selectedYear, selectedCategory }) => {
  const { events, loading, error } = useAllEvents(); 
  const [data, setData] = useState<Event[]>([]);

  // SRC: kilde: chatgpt.com  / med endringer
  useEffect(() => {
    if (events && events.length) {
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return false;
        const matchesMonth = selectedMonth === null || eventDate.getMonth() === selectedMonth;
        const matchesYear = selectedYear === null || eventDate.getFullYear() === selectedYear;
        const matchesCategory = selectedCategory === null || event.event_type === selectedCategory;
        const isNotPrivate = event.rules?.is_private === "false";

        return matchesMonth && matchesYear && matchesCategory && isNotPrivate;
      });

      setData(filteredEvents);
    }
  }, [events, selectedMonth, selectedYear, selectedCategory]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-600">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Laster arrangementer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl p-8">
        <div className="w-16 h-16 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Ops! Noe gikk galt</h3>
        <p className="text-red-600 text-center">Det oppstod en feil ved henting av arrangementer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {data.map((event) => (
            <EventCard 
              key={event.id}
              title={event.title} 
              description={event.description} 
              date={event.date} 
              location={event.location} 
              slug={event.slug}
              event_type={event.event_type}
              total_slots={event.total_slots}
              available_slots={event.available_slots}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 text-slate-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Ingen arrangementer funnet</h3>
          <p className="text-slate-600">Det finnes ingen arrangementer som matcher valgte filtre.</p>
        </div>
      )}
    </div>
  );
};

export default ListEvents;
