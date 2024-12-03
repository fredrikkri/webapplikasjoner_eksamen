import { Result } from "@/types";
import db, { DB } from "../db";
import { toDb } from "./template.mapper";
import { TemplateCreate } from "@/types/template";
import { Event } from "@/types/event";
import { TemplateIdRow } from "@/types/template";

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
        SELECT e.*, et.id as template_id
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
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed getting templates",
        },
      };
    }
  };
  
  const create = async (data: TemplateCreate): Promise<Result<string>> => {
    try {
      const eventExists = db.prepare("SELECT * FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      if (!eventExists) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Event with ID ${data.event_id} does not exist.`,
          },
        };
      }
      const event = db.prepare("SELECT id FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      const eventId: string = (event as { id: string }).id;
      const e: TemplateCreate = { event_id: eventId };

      const template = toDb(e);

      const query = db.prepare(`
        INSERT INTO events_template (event_id)
        VALUES (?)
      `);

      const result = query.run(template.event_id);
      const templateId = result.lastInsertRowid;

      return {
        success: true,
        data: String(templateId),
      };
    } catch (error) {
      console.error("Error creating template:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating template",
        },
      };
    }
  };

  const remove = async (id: string): Promise<Result<string>> => {
  const db_transaction = db.transaction(() => {
    console.log("Processing deletion for event ID:", id);
    try {
      const getTemplateIdWithEventId = db.prepare("SELECT id FROM events_template WHERE event_id = ?");
      const current_template_id_row = getTemplateIdWithEventId.get(id) as TemplateIdRow | undefined;

      if (current_template_id_row === null) {
        return "Template not deleted: Event exists";
      } else {
        const updateActiveEventQuery = db.prepare("UPDATE events_active SET template_id = NULL WHERE template_id = ?");
        updateActiveEventQuery.run(id);

        const deleteCourseQuery = db.prepare("DELETE FROM events_template WHERE event_id = ?");
        deleteCourseQuery.run(id);

        return id;
      }
    } catch (error) {
      console.error("Error in delete transaction:", error);
      throw error;
    }
  });

  try {
    const result = db_transaction();
    if (result === "Template not deleted: Event exists") {
      return {
        success: true as const,
        data: result,
      };
    }
    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    return {
      success: false as const,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting template",
      },
    };
  }
};

  

  // SRC: kilde: chatgpt.com  || med endringer /
  const getEventByTemplateSlug = async (eventSlug: string): Promise<Result<Event>> => {
    try {
      const query = db.prepare(`
        SELECT e.*, et.id as template_id 
        FROM events e 
        JOIN events_template et ON e.id = et.event_id 
        WHERE e.slug = ?
      `);
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

  return { list, create, getEventByTemplateSlug, remove }
}

export const templateRepository = createTemplateRepository(db);

export type TemplateRepository = ReturnType<typeof createTemplateRepository>;
