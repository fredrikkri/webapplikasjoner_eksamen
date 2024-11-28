import { Query } from "@/lib/query";
import { Result } from "@/types";
import { CreateRegistration, Registration, validateCreateRegistration } from "../../types/registration";
import { waitlistRepository, WaitlistRepository } from "./waitlist.repository";
import { createWaitlistRegistration, createWaitlistRegistrationResponse } from "./waitlist.mapper";


export const createWaitlistService = (waitlistRepository: WaitlistRepository)=> {

    const list = async (query?: Query): Promise<Result<Registration[]>> => {
        const result = await waitlistRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createWaitlistRegistrationResponse),
        };
      };

      const listOrders = async (event_slug?: string): Promise<Result<{ order_id: string; number_of_people: number; responsible_person: string; total_price: number }[]>> => {
        const result = await waitlistRepository.listOrders(event_slug);
        if (!result.success) return result;
    
        return {
          ...result
        };
      };

      const listOrder = async (event_slug?: string, order_id?: string): Promise<Result<Registration[]>> => {
        const result = await waitlistRepository.listOrder(event_slug, order_id);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createWaitlistRegistrationResponse),
        };
      };

      const create = async (data: CreateRegistration): Promise<Result<string>> => {
        const registration = createWaitlistRegistration(data);
    
        if (!validateCreateRegistration(registration).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Registration data" },
          };
        }
        const result = await waitlistRepository.create(registration)
        return result;
      };

      const getWaitlistRegistrationsByEventId = async (eventId: string): Promise<Result<CreateRegistration[] | undefined>> => {
        const result = await waitlistRepository.getWaitlistRegistrationById(eventId);
        if (!result.success) return result;

        return {
          ...result,
          data: result.data.map(createWaitlistRegistrationResponse),
        };
    };

    // SRC: kilde: chatgpt.com  || med justeringer /
    const deleteRegistration = async (registrationId: string): Promise<Result<void>> => {
      if (!registrationId) {
        return {
          success: false,
          error: { code: "BAD_REQUEST", message: "Registration ID is required" },
        };
      }
      return await waitlistRepository.deleteRegistration(registrationId);
    };

  return { list, listOrders, listOrder, create, getWaitlistRegistrationsByEventId, deleteRegistration }
}

export const waitlistService = createWaitlistService(waitlistRepository);

export type WaitlistService = ReturnType<typeof createWaitlistService>;
