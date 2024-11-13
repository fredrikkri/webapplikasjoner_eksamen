import { Query } from "@/lib/query";
import { Result } from "@/types";
import { Event } from "@/types/event";
import { activeEventsRepository, ActiveEventsRepository } from "./event_active.repository";
import { createActiveEvent, createActiveEventResponse } from "./event_active.mapper";
import { ActiveEventsCreate, validateActiveEventsCreate } from "../../types/activeEvents";

export const createActiveEventsService = (templateRepository: ActiveEventsRepository) => {

    const list = async (query?: Query): Promise<Result<Event[]>> => {
        const result = await templateRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createActiveEventResponse),
        };
      };

      const create = async (data: ActiveEventsCreate): Promise<Result<string>> => {
        const registration = createActiveEvent(data);
    
        if (!validateActiveEventsCreate(registration).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Active Events data" },
          };
        }
        return templateRepository.create(registration);
      };

      // SRC: kilde: chatgpt.com  || med endringer /
      const getActiveEventsByEventId = async (eventId: string): Promise<Result<Event | undefined>> => {
        const result = await templateRepository.getEventByActiveEventsId(eventId);
        
        if (!result.success) return result;
      
        if (result.data) {
          const templateResponse = createActiveEventResponse(result.data);
          return {
            success: true,
            data: templateResponse,
          };
        }
      
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "No template found for the provided event ID.",
          },
        };
      };
      

return { list, create, getActiveEventsByEventId };
};

export const activeEventsService = createActiveEventsService(activeEventsRepository);

export type ActiveEventsService = ReturnType<typeof createActiveEventsService>;