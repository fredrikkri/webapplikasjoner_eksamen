import { Result } from "@/types";
import db, { DB } from "../db";
import { toDb } from "./template.mapper";
import { TemplateCreate } from "@/types/template";

export const createTemplateRepository = (db: DB) => {

  const eventExist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM events_template WHERE event_id = ?"
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
        JOIN events_template et ON e.id = et.event_id
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
  
  const create = async (data: TemplateCreate): Promise<Result<string>> => {
    console.log("egg \n", data.event_id)
    try {
      const eventExists = db.prepare("SELECT * FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      console.log("events googog: ", eventExists)
      if (!eventExists) {
        console.log("fiedfmfeiojejiffjifrjifei")
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Event with ID ${data.event_id} does not exist.`,
          },
        };
      }
      const event = db.prepare("SELECT id FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      console.log("eventEEE: ", event)
      const eventId: string = (event as { id: string }).id;
      const e: TemplateCreate = { event_id: eventId }
      console.log("eID:", e)
      //const eventId: TemplateCreate = { event_id: event.id };
      //console.log("KEEKKEKEK ",eventId)
      

      const template = toDb(e);
      console.log("template REAL: ", template)
      //todo: lag en spørring som henter events sin id basert på slugen

      const query = db.prepare(`
        INSERT INTO events_template (event_id)
        VALUES (?)
      `);

      query.run(
        template.event_id
      );

      return {
        success: true,
        data: template.event_id,
      };
    } catch (error) {
      console.error("Error creating template:", error);
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
  const getEventByTemplateSlug = async (eventSlug: string): Promise<Result<Event>> => {
    try {
      const query = db.prepare("SELECT e.* FROM events e JOIN events_template et ON e.id = et.event_id WHERE e.slug = ?");
      const eventData = query.get(eventSlug) as Event;
  
      if (!eventData) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Event not found in templates" },
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
          message: "Error fetching event from templates",
        },
      };
    }
  };
  
  


      return { list, create, getEventByTemplateSlug }
}

export const templateRepository = createTemplateRepository(db);

export type TemplateRepository = ReturnType<typeof createTemplateRepository>;