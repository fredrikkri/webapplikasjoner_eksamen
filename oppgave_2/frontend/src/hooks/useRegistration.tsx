import { useState } from "react";
import { Registration as RegistrationType } from "../types/Registration";
import { createRegistration } from "../lib/services/registrations";

export const useCreateRegistration = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const addRegistration = async (eventData: RegistrationType) => {
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