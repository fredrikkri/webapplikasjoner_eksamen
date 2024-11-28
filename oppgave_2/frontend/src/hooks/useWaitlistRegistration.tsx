import { Registration, Registration as RegistrationType } from "../types/Registration";
import { createWaitlistRegistration, getWaitlist } from "../lib/services/waitlistRegistrations";
import { useState, useEffect } from 'react';

export const useWaitlist = (eventId: string) => {
  const [waitlist, setWaitlist] = useState<Registration[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        setLoading(true);
        // Assuming `getWaitlistByEvent` is a function that fetches waitlist data by event ID
        const waitlistData = await getWaitlist(eventId);
        setWaitlist(waitlistData as Registration[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching the waitlist data'));
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchWaitlist();
    }
  }, [eventId]);

  return { waitlist, loading, error };
};

export const useCreateWaitlistRegistration = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const addWaitlistRegistration = async (eventData: RegistrationType) => {
      try {
        setLoading(true);
        await createWaitlistRegistration(eventData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };
  
    return { addWaitlistRegistration, loading, error };
  };

