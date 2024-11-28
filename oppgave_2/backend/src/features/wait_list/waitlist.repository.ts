import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration } from "../../types/registration";
import { toDb } from "./waitlist.mapper";

export const createWaitlistRepository = (db: DB) => {

  const eventExist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM events WHERE id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

      const list = async (query?: Record<string, string>): Promise<Result<Registration[]>> => {
        try {
          const statement = db.prepare(`SELECT * from wait_list`);
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

      const listOrders = async (event_slug?: string): Promise<Result<{ order_id: string; number_of_people: number }[]>> => {
        const eventStatement = db.prepare(`SELECT id FROM events WHERE slug = ?`);
        const event = eventStatement.get(event_slug) as { id: string } | undefined;

        if (!event) {
          return {
            success: false,
            error: {
              code: "EVENT_NOT_FOUND",
              message: "Event not found for the provided slug",
            },
          };
        }

        const event_id: string = event.id;

        try {
          const statement = db.prepare(`
            SELECT DISTINCT order_id, COUNT(*) as number_of_people 
            from wait_list 
            WHERE event_id = ?
            GROUP BY order_id`);
          const data = statement.all(event_id) as { order_id: string; number_of_people: number }[];

    
          return {
            success: true,
            data,
          };
        } catch (error) {
          console.error("Error fetching registrations:", error);
          return {
            success: false,
            error: {
              code: "SOME_CODE_HERE",
              message: "Failed getting registrations",
            },
          };
        }
      };

            // SRC: kilde: chatgpt.com  || med justeringer /
      const listOrder = async (event_slug?: string, order_id?: string): Promise<Result<Registration[]>> => {
        try {
          if (!event_slug || !order_id) {
            return {
              success: false,
              error: {
                code: "INVALID_INPUT",
                message: "Event slug and order ID are required.",
              },
            };
          }
    
          const eventStatement = db.prepare(`SELECT id FROM events WHERE slug = ?`);
          const event = eventStatement.get(event_slug) as { id: string } | undefined;
      
          if (!event) {
            return {
              success: false,
              error: {
                code: "EVENT_NOT_FOUND",
                message: "Event not found for the provided slug.",
              },
            };
          }
      
          const eventId: string = event.id;

          const statement = db.prepare(`
            SELECT * FROM wait_list WHERE event_id = ? AND order_id = ?
          `);
          const data = statement.all(eventId, order_id) as Registration[];
      
          return {
            success: true,
            data,
          };
        } catch (error) {
          console.error("Error fetching registrations:", error);
      
          return {
            success: false,
            error: {
              code: "DB_ERROR",
              message: "Failed getting registrations.",
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
          console.log("Prepared waitlist-registration data for DB insert:", registration);
      
          const query = db.prepare(`
            INSERT INTO wait_list (id, event_id, email, has_paid, registration_date, order_id)
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
          console.error("Error during creation of waitlist-registration:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Feil med oppretting av registrering for ventelist",
            },
          };
        }
      };
  
      const getWaitlistRegistrationById = async (eventId: string): Promise<Result<Registration[]>> => {
        try {
        const exists = await eventExist(eventId);
        if (!exists) {
            return {
            success: false,
            error: { code: "NOT_FOUND", message: "Event not found" },
            };
        }
  
      const query = db.prepare("SELECT * FROM wait_list WHERE event_id = ?");
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

      const deleteRegistration = async (registrationId: string): Promise<Result<void>> => {
        try {
          const checkQuery = db.prepare("SELECT id FROM wait_list WHERE id = ?");
          const exists = checkQuery.get(registrationId);

          if (!exists) {
            return {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: "Registration not found",
              },
            };
          }

          const deleteQuery = db.prepare("DELETE FROM wait_list WHERE id = ?");
          deleteQuery.run(registrationId);

          return {
            success: true,
            data: undefined,
          };
        } catch (error) {
          console.error("Error deleting registration:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete registration",
            },
          };
        }
      };

      return { list, listOrders, listOrder, create, getWaitlistRegistrationById, deleteRegistration }
}

export const waitlistRepository = createWaitlistRepository(db);

export type WaitlistRepository = ReturnType<typeof createWaitlistRepository>;
