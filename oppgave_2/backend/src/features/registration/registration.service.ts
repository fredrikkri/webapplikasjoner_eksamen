import { Query } from "@/lib/query";
import { Result } from "@/types";
import { CreateRegistration, Registration, validateCreateRegistration } from "../../types/registration";
import { registrationRepository, RegistrationRepository } from "./registration.repository";
import { createRegistration, createRegistrationResponse } from "./registration.mapper";


export const createRegistrationService = (registrationRepository: RegistrationRepository)=> {

    const list = async (query?: Query): Promise<Result<Registration[]>> => {
        const result = await registrationRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createRegistrationResponse),
        };
      };

      const create = async (data: CreateRegistration): Promise<Result<string>> => {
        const registration = createRegistration(data);
    
        if (!validateCreateRegistration(registration).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Registration data" },
          };
        }
        return registrationRepository.create(registration);
      };

      const getRegistrationsByEventId = async (eventId: string): Promise<Result<Registration[] | undefined>> => {
        const result = await registrationRepository.getRegistrationById(eventId);
        if (!result.success) return result;

        return {
          ...result,
          data: result.data.map(createRegistrationResponse),
        };
        
    };


      return { list, create, getRegistrationsByEventId }
}

export const registrationService = createRegistrationService(registrationRepository);

export type RegistrationService = ReturnType<typeof createRegistrationService>;