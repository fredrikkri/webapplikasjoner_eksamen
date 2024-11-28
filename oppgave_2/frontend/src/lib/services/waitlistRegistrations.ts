import { ENDPOINTS } from "@/config/config";
import { Registration, Registration as RegistrationType } from "../../types/Registration";

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


  export const getWaitlist = async (eventId: string): Promise<Registration[] | null> => {
    try {
      const response = await fetch(ENDPOINTS.getWishlist(eventId));
  
      if (!response.ok) {
        throw new Error(`Failed to fetch waitlist for event ${eventId}: ${response.statusText}`);
      }
  
      const waitlistData: Registration[] = await response.json();
    
      return waitlistData.data;
    } catch (error) {
      
      return null;
    }
  };
  
  
  