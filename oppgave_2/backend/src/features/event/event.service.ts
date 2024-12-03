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

      const remove = async (id: string): Promise<Result<string>> => {
        return eventRepository.remove(id);
      };

      const getById = async (slug: string): Promise<Result<Event | undefined>> => {
        return eventRepository.getById(slug);
      };

      const edit = async (data: Event): Promise<Result<string>> => {
        return eventRepository.edit(data);
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
          console.log("Starting transaction for event creation");
          db.exec('BEGIN TRANSACTION');

          const result = await eventRepository.create(event);
          
          if (!result.success) {
            console.error("Failed to create event:", result.error);
            db.exec('ROLLBACK');
            return result;
          }

          console.log("Event created successfully, creating rules");
          const rulesResult = await rulesService.create(result.data, {
            is_private: rules.is_private,
            restricted_days: rules.restricted_days,
            allow_multiple_events_same_day: rules.allow_multiple_events_same_day,
            waitlist: rules.waitlist,
            fixed_price: rules.fixed_price,
            fixed_size: rules.fixed_size,
            is_free: rules.is_free
          });
          
          if (!rulesResult.success) {
            console.error("Failed to create rules:", rulesResult.error);
            db.exec('ROLLBACK');
            return rulesResult;
          }

          console.log("Rules created successfully, committing transaction");
          db.exec('COMMIT');
          return result;

        } catch (error) {
          console.error("Transaction error:", error);
          db.exec('ROLLBACK');
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error creating event with rules",
            },
          };
        }
      };


const updateEventASlots = async (event_id: string, available_slots: number): Promise<Result<string>> => {
  return eventRepository.updateAvailableSlots(event_id, available_slots);
};


return {
    updateEventASlots,
    list,
    getById,
    create,
    remove,
    edit
  };
};

export const eventService = createEventService(eventRepository);

export type EventService = ReturnType<typeof createEventService>;
