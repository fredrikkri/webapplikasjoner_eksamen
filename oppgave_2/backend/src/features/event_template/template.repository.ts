import { Result } from "@/types";
import db, { DB } from "../db";

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
      
      // Fetch data from the database
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
  
  


      return { list }
}

export const templateRepository = createTemplateRepository(db);

export type TemplateRepository = ReturnType<typeof createTemplateRepository>;