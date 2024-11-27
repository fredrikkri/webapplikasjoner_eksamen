import { ENDPOINTS } from "@/config/config";
import { Registration as RegistrationType } from "../../types/Registration";

export const createWaitlistRegistration = async (data: RegistrationType): Promise<void> => {
    console.log("current waitlist-registration", data)
    try {
      const response = await fetch(ENDPOINTS.createWaitlistRegistration, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create waitlist-registration: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating waitlist-registration:", error);
    }
  };