import { Result } from "@/types/index";
import db, { DB } from "../db";
import { toDb } from "./event_active.mapper";
import { ActiveEventsCreate } from "../../types/activeEvents";
import { Event } from "../../types/event";

export const createActiveEventsRepository = (db: DB) => {

  const eventExist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM events_active WHERE event_id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

  const list = async (query?: Record<string, string>): Promise<Result<Event[]>> => {
    try {
      const statement = db.prepare(`
        SELECT e.*, ea.template_id, et.event_id as template_event_id
        FROM events e
        JOIN events_active ea ON e.id = ea.event_id
        LEFT JOIN events_template et ON ea.template_id = et.id
      `);
      
      const data = statement.all() as (Event & { template_id?: number })[];
  
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed getting active events",
        },
      };
    }
  };
  
  const create = async (data: ActiveEventsCreate): Promise<Result<string>> => {
    try {
      const event = db.prepare("SELECT id FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      if (!event) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Event with slug ${data.event_id} does not exist.`,
          },
        };
      }

      const eventId: string = (event as { id: string }).id;

      if (data.template_id !== undefined) {
        const template = db.prepare("SELECT id FROM events_template WHERE id = ?").get(data.template_id);
        if (!template) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: `Template with ID ${data.template_id} does not exist.`,
            },
          };
        }
      }

      const query = db.prepare(`
        INSERT INTO events_active (event_id, template_id)
        VALUES (?, ?)
      `);

      query.run(eventId, data.template_id);

      return {
        success: true,
        data: eventId,
      };
    } catch (error) {
      console.error("Error creating active event:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating active event",
        },
      };
    }
  };

  const getEventByActiveEventsSlug = async (eventSlug: string): Promise<Result<Event>> => {
    try {
      const query = db.prepare(`
        SELECT e.*, ea.template_id, et.event_id as template_event_id
        FROM events e 
        JOIN events_active ea ON e.id = ea.event_id 
        LEFT JOIN events_template et ON ea.template_id = et.id 
        WHERE e.slug = ?
      `);
      const eventData = query.get(eventSlug) as Event & { template_id?: number };
  
      if (!eventData) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Event not found in active events" },
        };
      }
  
      return {
        success: true,
        data: eventData,
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching event from active events",
        },
      };
    }
  };

  return { list, create, getEventByActiveEventsSlug }
}

export const activeEventsRepository = createActiveEventsRepository(db);

export type ActiveEventsRepository = ReturnType<typeof createActiveEventsRepository>;
