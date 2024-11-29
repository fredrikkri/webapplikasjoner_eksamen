import { useState } from "react";
import { Registration  } from "../types/Registration";
import { createRegistration, createRegistrationById } from "../lib/services/registrations";

export const useCreateRegistration = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const addRegistration = async (eventData: Registration) => {
      console.log("eDATA", eventData)
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
