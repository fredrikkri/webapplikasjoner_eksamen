import { useState, useEffect } from "react";
import { getEvent, getAllEvents, createEvent } from "../lib/services/events";
import { Event as EventType } from "../types/Event";

export const useAllEvents = () => {
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventdata = await getAllEvents();
        setEvents(eventdata as unknown as EventType[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Kunne ikke hente arrangementer'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventdata = await getEvent(eventSlug);
        setEvent(eventdata as unknown as EventType);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Kunne ikke hente arrangement'));
      } finally {
        setLoading(false);
      }
    };

    if (eventSlug) {
      fetchEvent();
    }
  }, [eventSlug]);

  return { event, loading, error };
};

export const useCreateEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = async (eventData: Omit<EventType, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedEventData = {
        ...eventData,
        rules: {
          ...eventData.rules,
          is_private: eventData.rules?.is_private || "false",
          allow_multiple_events_same_day: eventData.rules?.allow_multiple_events_same_day || "true",
          waitlist: eventData.rules?.waitlist || "true",
          restricted_days: eventData.rules?.restricted_days || null,
          fixed_price: eventData.rules?.fixed_price || "false",
          fixed_size: eventData.rules?.fixed_size || "false",
          is_free: eventData.rules?.is_free || "false"
        }
      };

      const result = await createEvent(formattedEventData);
      
      if (!result.success) {
        setError(result.error?.message || "Kunne ikke opprette arrangement");
        return result;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke opprette arrangement';
      setError(errorMessage);
      return {
        success: false,
        error: { message: errorMessage }
      };
    } finally {
      setLoading(false);
    }
  };

  return { addEvent, loading, error };
};
