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
    try {
      const template = toDb(data);

      const query = db.prepare(`
        INSERT INTO events_templates (id, event_id)
        VALUES (?, ?)
      `);

      query.run(
        template.id,
        template.event_id
      );

      return {
        success: true,
        data: template.id,
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
  


      return { list, create }
}

export const templateRepository = createTemplateRepository(db);

export type TemplateRepository = ReturnType<typeof createTemplateRepository>;