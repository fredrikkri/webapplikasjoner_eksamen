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

  export const deleteWaitlistRegistration = async (registrationId: string): Promise<boolean> => {
    try {
      const url = ENDPOINTS.deleteWaitlistItem(registrationId);
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete registration with ID ${registrationId}: ${response.statusText}`);
      }
  
      console.log(`Successfully deleted registration with ID: ${registrationId}`);
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      return false;
    }
  };
  
  
  