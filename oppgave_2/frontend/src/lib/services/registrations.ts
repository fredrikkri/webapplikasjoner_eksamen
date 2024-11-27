import { ENDPOINTS } from "@/config/config";
import { Registration as RegistrationType } from "../../types/Registration";

export const createRegistration = async (data: RegistrationType): Promise<void> => {
    console.log("current registration", data)
    try {
      const response = await fetch(ENDPOINTS.createRegistration, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create registration: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating registration:", error);
    }
  };