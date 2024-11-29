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
import { db } from "../db";

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

        try {
          db.exec('BEGIN TRANSACTION');

          const result = await eventRepository.create(event);
          
          if (!result.success) {
            db.exec('ROLLBACK');
            return result;
          }

          const rulesResult = await rulesService.create(result.data, rules);
          
          if (!rulesResult.success) {
            db.exec('ROLLBACK');
            return rulesResult;
          }

          db.exec('COMMIT');
          return result;

        } catch (error) {
          db.exec('ROLLBACK');
          console.error("Transaction error:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error creating event with rules",
            },
          };
        }
      };

return {
    list,
    getById,
    create
  };
};

export const eventService = createEventService(eventRepository);

export type EventService = ReturnType<typeof createEventService>;
