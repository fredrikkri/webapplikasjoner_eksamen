import { Registration, Registration as RegistrationType } from "../types/Registration";
import { createWaitlistRegistration, deleteWaitlistRegistration, getAttendersWaitList, getWaitlist } from "../lib/services/waitlistRegistrations";
import { useState, useEffect } from 'react';

export const useWaitlist = (eventId: string) => {
  const [waitlist, setWaitlist] = useState<Registration[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        setLoading(true);
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

  export const deleteRegistration = async (registrationId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    try {
      const isDeleted = await deleteWaitlistRegistration(registrationId);

      if (isDeleted) {
        setSuccess(true);
      } 

    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  export const getWaitListByEventId = (eventId: string) => {
    const [waitlist, setWaitlist] = useState<Registration[] | null>(null); // Store the waitlist data
    const [loading, setLoading] = useState<boolean>(true); // Track loading state
    const [error, setError] = useState<string | null>(null); // Track error state
  
    useEffect(() => {
      // Async function to fetch the waitlist
      const fetchWaitlist = async () => {
        setLoading(true); // Set loading to true while fetching
        setError(null); // Reset error before fetching
        setWaitlist(null); // Reset waitlist data
  
        try {
          // Fetch the waitlist data using the updated function
          const waitlistData = await getAttendersWaitList(eventId);
  
          if (waitlistData) {
            setWaitlist(waitlistData); // Store the fetched waitlist data
          } else {
            setError('No waitlist data available.');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred while fetching the waitlist data');
        } finally {
          setLoading(false); // Set loading to false once the fetch is done
        }
      };
  
      if (eventId) {
        fetchWaitlist(); // Fetch waitlist data if eventId exists
      }
    }, [eventId]); // Re-run when eventId changes
  
    return { waitlist, loading, error }; // Return the state
  };