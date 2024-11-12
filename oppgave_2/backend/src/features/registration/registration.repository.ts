import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration } from "@/types/registration";
import { toDb } from "./registration.mapper";


export const createRegistrationRepository = (db: DB) => {

  const eventExist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM events WHERE id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

      const list = async (query?: Record<string, string>): Promise<Result<Registration[]>> => {
        try {
          const statement = db.prepare(`SELECT * from registrations`);
          const data = statement.all() as Registration[];
    
          return {
            success: true,
            data,
          };
        } catch (error) {

          return {
            success: false,
            error: {
              code: "SOME_CODE_HERE",
              message: "Failed getting registrations",
            },
          };
        }
      };

      const create = async (data: CreateRegistration): Promise<Result<string>> => {
        try {
          const registration = toDb(data);
    
          const query = db.prepare(`
            INSERT INTO courses (id, event_id, email, had_paid, registration_date)
            VALUES (?, ?, ?, ?, ?)
          `);
          query.run(
            registration.id,
            registration.event_id,
            registration.email,
            registration.had_paid,
            registration.registration_date
          );
          return {
            success: true,
            data: registration.id,
          };
        } catch (error) {
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Feil med oppretting av registration",
            },
          };
        }
      };

      
      const getRegistrationById = async (eventId: string): Promise<Result<Registration[]>> => {
        try {
        const lessonExists = await eventExist(eventId);
        if (!lessonExists) {
            return {
            success: false,
            error: { code: "NOT_FOUND", message: "Event not found" },
            };
        }
  
      const query = db.prepare("SELECT * FROM registrations WHERE event_id = ?");
      const regdata = query.all(eventId) as Registration[];
  
      if (regdata.length === 0) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "No registrations found for this event" },
        };
      }

      return {
        success: true,
        data: regdata,
      };
  
    } catch (error) {
      console.error("Error fetching lesson:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching registrations",
        },
      };
    }
}

      return { list, create, getRegistrationById }
}

export const registrationRepository = createRegistrationRepository(db);

export type RegistrationRepository = ReturnType<typeof createRegistrationRepository>;