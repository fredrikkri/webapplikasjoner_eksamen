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
      // Fetch data from the endpoint with dynamic eventId
      const response = await fetch(ENDPOINTS.getWishlist(eventId));
  
      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`Failed to fetch waitlist for event ${eventId}: ${response.statusText}`);
      }
  
      // Parse the response as JSON
      const waitlistData: Registration[] = await response.json();
  
      console.log('Fetched waitlist:', waitlistData);
  
      // Return the waitlist data
      return waitlistData;
    } catch (error) {
      // Log the error if it occurs during the fetch
      console.error("Error fetching waitlist data:", error);
      
      // Return null if there's an error
      return null;
    }
  };
  
  
  