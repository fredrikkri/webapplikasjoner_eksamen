import { ENDPOINTS } from "@/config/config";
import { Registration, Registration as RegistrationType } from "../../types/Registration";

// SRC: kilde: chatgpt.com  || med endringer /
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

// SRC: kilde: chatgpt.com  || med endringer /
  export const getWaitlist = async (eventId: string): Promise<Registration[] | null> => {
    try {
      const response = await fetch(ENDPOINTS.getWishlist(eventId));
  
      if (!response.ok) {
        return null;
      }
        const waitlistData = (await response.json()) as { data: Registration[] };

      return waitlistData.data;
    } catch (error) {
      console.error("Error fetching:", error);
      return null;
    }
  };
  
  // SRC: kilde: chatgpt.com  || med endringer /
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
  
  // SRC: kilde: chatgpt.com  || med endringer /
export const getAttendersWaitList = async (eventId: string): Promise<Registration[] | null> => {
  try {
    const response = await fetch(ENDPOINTS.getAttendersWaitList(eventId));

    if (!response.ok) {
      return null;
    }

    const waitlistData = await response.json();

    return waitlistData.data || null;

  } catch (error) {
    console.error('Error fetching waitlist:', error);

    return null;
  }
};
