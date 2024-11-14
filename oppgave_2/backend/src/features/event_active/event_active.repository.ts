import { Result } from "@/types";
import db, { DB } from "../db";
import { toDb } from "./event_active.mapper";
import { ActiveEventsCreate } from "../../types/activeEvents";

export const createActiveEventsRepository = (db: DB) => {

  const eventExist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM events_active WHERE event_id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  const list = async (query?: Record<string, string>): Promise<Result<Event[]>> => {
    try {
      const statement = db.prepare(`
        SELECT e.*
        FROM events e
        JOIN events_active et ON e.id = et.event_id
      `);
      
      const data = statement.all() as Event[];
  
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "SOME_CODE_HERE",
          message: "Failed getting templates",
        },
      };
    }
  };
  
  const create = async (data: ActiveEventsCreate): Promise<Result<string>> => {
    try {
      const events = toDb(data);

      const query = db.prepare(`
        INSERT INTO events_active (id, event_id)
        VALUES (?, ?)
      `);

      query.run(
        events.id,
        events.event_id
      );

      return {
        success: true,
        data: events.id,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med oppretting av template",
        },
      };
    }
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  const getEventByActiveEventsSlug = async (eventSlug: string): Promise<Result<Event>> => {
    try {
      const query = db.prepare("SELECT e.* FROM events e JOIN events_active et ON e.id = et.event_id WHERE e.slug = ?");
      const eventData = query.get(eventSlug) as Event;
  
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