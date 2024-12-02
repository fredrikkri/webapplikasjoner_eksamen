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
          message: "Kunne ikke hente aktive arrangementer",
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
            message: `Arrangement med ID ${data.event_id} finnes ikke.`,
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
              message: `Mal med ID ${data.template_id} finnes ikke.`,
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
      console.error("Feil ved opprettelse av aktivt arrangement:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Det oppstod en feil ved opprettelse av arrangementet.",
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
          error: { 
            code: "NOT_FOUND", 
            message: "Fant ikke arrangementet i aktive arrangementer" 
          },
        };
      }
  
      return {
        success: true,
        data: eventData,
      };
    } catch (error) {
      console.error("Feil ved henting av arrangement:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Det oppstod en feil ved henting av arrangementet",
        },
      };
    }
  };

  return { list, create, getEventByActiveEventsSlug }
}

export const activeEventsRepository = createActiveEventsRepository(db);

export type ActiveEventsRepository = ReturnType<typeof createActiveEventsRepository>;
