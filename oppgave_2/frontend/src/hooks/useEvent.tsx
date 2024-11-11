import { useState, useEffect } from "react";
import { getEvent, getAllEvents } from "../lib/services/events";
import {Event as EventType} from "../types/Event"

export const useAllEvents = () => {
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventdata = await getAllEvents();
        setEvents(eventdata as EventType[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching all events'));
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
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const eventdata = await getEvent(eventSlug);
        setEvent(eventdata as EventType);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (eventSlug) {
      fetchCourse();
    }
  }, [eventSlug]);

  return { event, loading, error };
};