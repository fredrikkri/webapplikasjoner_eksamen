import { Query } from "@/lib/query";
import { Result } from "@/types";
import { Event } from "@/types/event";
import { activeEventsRepository, ActiveEventsRepository } from "./event_active.repository";
import { createActiveEvent, createActiveEventResponse } from "./event_active.mapper";
import { ActiveEventsCreate, validateActiveEventsCreate } from "../../types/activeEvents";

export const createActiveEventsService = (activeEventsRepository: ActiveEventsRepository) => {

    const list = async (query?: Query): Promise<Result<Event[]>> => {
        const result = await activeEventsRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createActiveEventResponse),
        };
    };

    const create = async (data: ActiveEventsCreate): Promise<Result<string>> => {
        console.log('Received data:', data); // Debug log
        const registration = createActiveEvent(data);
        console.log('Transformed data:', registration); // Debug log
    
        const validationResult = validateActiveEventsCreate(registration);
        console.log('Validation result:', validationResult); // Debug log
        
        if (!validationResult.success) {
          return {
            success: false,
            error: { 
              code: "BAD_REQUEST", 
              message: `Invalid Active Event data: ${validationResult.error.message}` 
            },
          };
        }
        return activeEventsRepository.create(registration);
    };

    const getActiveEventsByEventSlug = async (eventSlug: string): Promise<Result<Event | undefined>> => {
        const result = await activeEventsRepository.getEventByActiveEventsSlug(eventSlug);
        
        if (!result.success) return result;
      
        if (result.data) {
          const eventResponse = createActiveEventResponse(result.data);
          return {
            success: true,
            data: eventResponse,
          };
        }
      
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "No active event found for the provided event slug.",
          },
        };
    };
      
    return { list, create, getActiveEventsByEventSlug };
};

export const activeEventsService = createActiveEventsService(activeEventsRepository);

export type ActiveEventsService = ReturnType<typeof createActiveEventsService>;
