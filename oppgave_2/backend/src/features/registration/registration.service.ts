import { Query } from "@/lib/query";
import { Result } from "@/types";
import { CreateRegistration, Registration, RegistrationEvent } from "../../types/registration";
import { registrationRepository, RegistrationRepository } from "./registration.repository";
import { createRegistration, createRegistrationResponse, createRegistrationResponseGet } from "./registration.mapper";
import { createId } from "../../util/utils";


export const createRegistrationService = (registrationRepository: RegistrationRepository)=> {

    const list = async (query?: Query): Promise<Result<RegistrationEvent[]>> => {
        const result = await registrationRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createRegistrationResponseGet),
        };
      };

      const createByOrderID = async (order_id: string[]): Promise<Result<string>> => {
      
        const result = await registrationRepository.createByOrderId(order_id)
        return result;
      };

      const create = async (data: CreateRegistration[]): Promise<Result<string>> => {
        try {
          const registrations = data.map((registration) => {
            const newRegistration = {
              ...registration,
              id: registration.id ?? createId(),
              order_id: createId(),
              registration_date: new Date().toISOString(),
            };
      
            return newRegistration; // Return transformed registration object
          });
      
          // Call the repository function to insert the registrations into the database
          const result = await registrationRepository.create(registrations); // Assuming create() can handle an array of registrations
      
          // Return success result
          return result;
        } catch (error) {
          console.error("Error creating registrations:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error during the creation of registrations",
            },
          };
        }
      };
      

      const bookSlot = async (data: CreateRegistration): Promise<Result<string>> => {
        const registration = createRegistration(data);
    
        // if (!validateCreateRegistration(registration).success) {
        //   return {
        //     success: false,
        //     error: { code: "BAD_REQUEST", message: "Invalid Registration data" },
        //   };
        // }
        const result = await registrationRepository.bookSlot(registration.event_id)
        return result;
        
        
      };

      const getRegistrationsByEventId = async (eventId: string): Promise<Result<Registration[] | undefined>> => {
        const result = await registrationRepository.getRegistrationById(eventId);
        if (!result.success) return result;

        return {
          ...result,
          data: result.data.map(createRegistrationResponse),
        };
    };

    const deleteRegistration = async (id: string | undefined): Promise<Result<void>> => {
      if (!id) {
        return {
          success: false,
          error: { code: "BAD_REQUEST", message: "Registration ID is required" },
        };
      }
      return await registrationRepository.deleteRegistration(id);
    };

  return { list, create, getRegistrationsByEventId, bookSlot, createByOrderID, deleteRegistration }
}

export const registrationService = createRegistrationService(registrationRepository);

export type RegistrationService = ReturnType<typeof createRegistrationService>;