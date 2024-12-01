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

  // SRC: kilde: chatgpt.com  || med endringer /
  export const getWaitListByEventId = (eventId: string) => {
    const [waitlist, setWaitlist] = useState<Registration[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchWaitlist = async () => {
        setLoading(true);
        setError(null);
        setWaitlist(null);
  
        try {
          const waitlistData = await getAttendersWaitList(eventId);
  
          if (waitlistData) {
            setWaitlist(waitlistData);
          } else {
            setError('No waitlist data available.');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred while fetching the waitlist data');
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