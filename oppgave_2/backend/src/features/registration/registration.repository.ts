import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration } from "../../types/registration";
import { toDb } from "./registration.mapper";
import {type EventCreate, type Event} from "../../types/event";


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
      const event = db.prepare("SELECT id FROM events WHERE slug = ? LIMIT 1").get(data.event_id);
      const eventId: string = (event as { id: string }).id;
      const e: Registration = { ...data, event_id: eventId }


          const registration = toDb(e);
          console.log("Prepared registration data for DB insert:", registration);
      
          const query = db.prepare(`
            INSERT INTO registrations (id, event_id, email, has_paid, registration_date, order_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `);
      
          query.run(
            registration.id,
            registration.event_id,
            registration.email,
            registration.has_paid,
            registration.registration_date,
            registration.order_id
          );
      
          return {
            success: true,
            data: registration.id,
          };
        } catch (error) {
          console.error("Error during creation of registration:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Feil med oppretting av registration",
            },
          };
        }
      };

      // SRC: kilde: chatgpt.com  || med endringer /
      const bookSlot = async (event_id: string): Promise<Result<string>> => {
        try {
          const event = db.prepare("SELECT * FROM events WHERE slug = ? LIMIT 1").get(event_id) as Event | undefined;;
      
          if (!event) {
            return { success: false, error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error decreasing available slots",
            },
          };
          }
          console.log("Final event yoyoyoy; ", event)
      
          if (event.available_slots <= 0) {
            return { success: false, error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error, there are none avalible slots"} };
          }

          const updateResult = db
            .prepare("UPDATE events SET available_slots = available_slots - 1 WHERE slug = ?")
            .run(event_id);
      
          if (updateResult.changes === 0) {
            return { success: false, error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error, failed to update avalible slots"}  };
          }
      
          return { success: true, data: "Slot successfully booked" };
        } catch (error) {
          console.error("Error booking slot:", error);
          return { success: false, error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error happend"}  };
        }
      };
      

      
      const getRegistrationById = async (eventId: string): Promise<Result<Registration[]>> => {
        try {
        const exists = await eventExist(eventId);
        if (!exists) {
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

      return { list, create, getRegistrationById, bookSlot }
}

export const registrationRepository = createRegistrationRepository(db);

export type RegistrationRepository = ReturnType<typeof createRegistrationRepository>;