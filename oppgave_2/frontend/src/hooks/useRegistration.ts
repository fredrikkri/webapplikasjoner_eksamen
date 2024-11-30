import { useEffect, useState } from "react";
import { Registration, RegistrationEventData  } from "../types/Registration";
import {  createRegistration, createRegistrationById, deleteRegistration, getAllEventsRegistrations } from "../lib/services/registrations";

export const useCreateRegistration = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const addRegistration = async (eventData: RegistrationEventData[]) => {
      try {
        setLoading(true);
        await createRegistration(eventData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };
  
    return { addRegistration, loading, error };
  };

  export const useCreateRegistrationById = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const addRegistration = async (order_id: string[]) => {
      try {
        setLoading(true);
        await createRegistrationById(order_id);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };
  
    return { addRegistration, loading, error };
  };

  export const useAllRegistrations = () => {
    const [events, setEvents] = useState<RegistrationEventData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const eventdata = await getAllEventsRegistrations();
          setEvents(eventdata as unknown as RegistrationEventData[]);
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
  export const deleteRegistrationById = async (registrationId: string) => {
    try {
      const isDeleted = await deleteRegistration(registrationId);
      return isDeleted;
    } catch (err) {
      console.error("Error during deletion:", err);
      throw err;
    }
  };