import { ENDPOINTS } from "@/config/config";
import { Registration } from "../../types/Registration";

export const createRegistration = async (data: Registration): Promise<void> => {
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

  export const createRegistrationById = async (order_id: string[]): Promise<void> => {
    console.log("current registration", order_id)
    try {
      const response = await fetch(ENDPOINTS.createRegistrationById, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order_id),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create registration: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating registration:", error);
    }
  };