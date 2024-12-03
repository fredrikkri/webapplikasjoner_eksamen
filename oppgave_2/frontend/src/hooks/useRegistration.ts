import { useEffect, useState } from "react";
import { Registration, RegistrationEventData  } from "../types/Registration";
import {  createRegistration, createRegistrationById, deleteRegistration, getAllEventsRegistrations, getAllRegisteredMembers } from "../lib/services/registrations";

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

  // SRC: kilde: chatgpt.com  || med endringer /
  export const useAllRegistrations = () => {
    const [events, setEvents] = useState<RegistrationEventData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
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

    useEffect(() => {
      fetchEvents();
    }, []);
  
    return { events, setEvents, loading, error, refetch: fetchEvents };
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

  // SRC: kilde: chatgpt.com  || med endringer /
  export const useAllRegistrationsMembersByEventId = (id: string | undefined) => {
    const [registrationMembers, setRegistrationMembers] = useState<RegistrationEventData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      if (!id) {
        setLoading(false);
        return;
      }
  
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const eventdata = await getAllRegisteredMembers(id);
          setRegistrationMembers(eventdata as unknown as RegistrationEventData[]);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An error occurred while fetching all events'));
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvents();
    }, [id]);
  
    return { registrationMembers, loading, error };
  };
