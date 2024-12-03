import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration, RegistrationEvent } from "../../types/registration";
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

      // SRC: kilde: chatgpt.com  || med justeringer /
      const listOrders = async (event_slug?: string): 
      Promise<Result<{ 
        order_id: string;
         number_of_people: number; 
         responsible_person: string; 
         total_price: number;
         registration_date: string;
        }[]>> => {
        const eventStatement = db.prepare(`SELECT id, price FROM events WHERE slug = ?`);
        const event = eventStatement.get(event_slug) as { id: string; price: number } | undefined;
      
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
        const event_price: number = event.price;
      
        try {
          const statement = db.prepare(`
            SELECT order_id, COUNT(*) as number_of_people, registration_date 
            FROM wait_list
            WHERE event_id = ?
            GROUP BY order_id
          `);
          const orders = statement.all(event_id) as { order_id: string; number_of_people: number; registration_date: string; }[];
          console.log(orders)
      
          const result = await Promise.all(
            orders.map(async (order) => {
              const responsiblePersonStatement = db.prepare(`
                SELECT email 
                FROM wait_list
                WHERE order_id = ?
                LIMIT 1
              `);
              const responsiblePerson = responsiblePersonStatement.get(order.order_id) as { email: string, registration_date: string } | undefined;
      
              const total_price = order.number_of_people * event_price;
      
              return {
                order_id: order.order_id,
                number_of_people: order.number_of_people,
                responsible_person: responsiblePerson?.email || 'N/A',
                total_price: total_price,
                registration_date: order.registration_date
              };
            })
          );
      
          return {
            success: true,
            data: result,
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
      const e: RegistrationEvent = { ...data, event_id: eventId }


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
  
      // SRC: kilde: chatgpt.com  || med endringer /
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
          success: true,
          data: regdata,
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

      // SRC: kilde: chatgpt.com  || med endringer /
      const deleteRegistration = async (registrationId: string): Promise<Result<void>> => {
        try {
          const checkQuery = db.prepare("SELECT id FROM wait_list WHERE order_id = ?");
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

          const deleteQuery = db.prepare("DELETE FROM wait_list WHERE order_id = ?");
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
