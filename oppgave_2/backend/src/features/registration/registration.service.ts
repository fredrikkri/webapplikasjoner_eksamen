import { Query } from "@/lib/query";
import { Result } from "@/types";
import { Registration } from "@/types/registration";
import { registrationRepository, RegistrationRepository } from "./registration.repository";
import { createRegistrationResponse } from "./registration.mapper";


export const createRegistrationService = (registrationRepository: RegistrationRepository)=> {

    const list = async (query?: Query): Promise<Result<Registration[]>> => {
        const result = await registrationRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createRegistrationResponse),
        };
      };


      return { list }
}

export const registrationService = createRegistrationService(registrationRepository);

export type RegistrationService = ReturnType<typeof createRegistrationService>;