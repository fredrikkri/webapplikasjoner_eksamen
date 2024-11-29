import type { Result } from "../../types/index";
import {
  eventRepository,
  type EventRepository,
} from "./event.repository";

import {
    validateEventCreate,
    EventCreate,
    type Event,
    type EventResponse,
  } from "../../types/event";

import { createEvent, createEventResponse } from "./event.mapper";
import type { Query } from "../../lib/query";
import { rulesService } from "../rules/rules.service";

export const createEventService = (eventRepository: EventRepository) => {

    const list = async (query?: Query): Promise<Result<EventResponse[]>> => {
        const result = await eventRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createEventResponse),
        };
      };

      const getById = async (slug: string): Promise<Result<Event | undefined>> => {
        return eventRepository.getById(slug);
      };

      const create = async (data: EventCreate): Promise<Result<string>> => {
        const { rules, ...eventData } = data;
        const event = createEvent({ ...eventData, rules });
    
        if (!validateEventCreate(event).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Event data" },
          };
        }
        const result = await eventRepository.create(event);
        
        if (result.success) {
            // Create rules with the provided configuration
            await rulesService.create(event.id, rules);
        }
        
        return result;
      };

return {
    list,
    getById,
    create
  };
};

export const eventService = createEventService(eventRepository);

export type EventService = ReturnType<typeof createEventService>;
