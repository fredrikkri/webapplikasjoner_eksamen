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

      const create = async (data: Event): Promise<Result<string>> => {
        console.log("nesten i mål", data)
        const event = createEvent(data);
    
        if (!validateEventCreate(event).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Event data" },
          };
        }
        return eventRepository.create(event);
      };

return {
    list,
    getById,
    create
  };
};

export const eventService = createEventService(eventRepository);

export type EventService = ReturnType<typeof createEventService>;