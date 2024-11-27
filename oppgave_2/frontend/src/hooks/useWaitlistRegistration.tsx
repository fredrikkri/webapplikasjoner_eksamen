import { useState } from "react";
import { Registration as RegistrationType } from "../types/Registration";
import { createWaitlistRegistration } from "../lib/services/waitlistRegistrations";

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