import { useState, useEffect } from "react";
import { Event } from "../types/Event";
import { ENDPOINTS } from "@/config/config";
import { onAddActiveEvent } from "@/lib/services/activeEvents";

export const useActiveEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.events}/${eventSlug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch active event");
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error.message || "Failed to fetch active event");
        }
        setEvent(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching active event'));
      } finally {
        setLoading(false);
      }
    };

    if (eventSlug) {
      fetchActiveEvent();
    }
  }, [eventSlug]);

  return { event, loading, error };
};

export const useAllActiveEvents = () => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(ENDPOINTS.events);
        if (!response.ok) {
          throw new Error("Failed to fetch active events");
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error.message || "Failed to fetch active events");
        }
        setEvents(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching active events'));
      } finally {
        setLoading(false);
      }
    };

    fetchActiveEvents();
  }, []);

  return { events, loading, error };
};

export const useCreateActiveEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createActiveEvent = async (eventId: string, templateId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await onAddActiveEvent({ 
        event_id: eventId,
        template_id: templateId 
      });

      if (!result.success) {
        setError(result.error?.message || "Failed to create active event");
        throw new Error(result.error?.message);
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating active event';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createActiveEvent, loading, error };
};
