import type { Result } from "../../types/index";
import {
  eventRepository,
  type EventRepository,
} from "./event.repository";

import {
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

return {
    list,
    getById,
  };
};

export const eventService = createEventService(eventRepository);

export type EventService = ReturnType<typeof createEventService>;