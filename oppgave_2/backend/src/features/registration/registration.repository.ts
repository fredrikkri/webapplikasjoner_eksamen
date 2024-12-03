import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration, RegistrationEvent } from "../../types/registration";
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

      const list = async (query?: Record<string, string>): Promise<Result<RegistrationEvent[]>> => {
        try {
          const statement = db.prepare(`SELECT * from registrations`);
          const data = statement.all() as RegistrationEvent[];
    
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

      // SRC: kilde: chatgpt.com  || med endringer /
      const create = async (data: CreateRegistration[]): Promise<Result<string>> => {
        try {

          const registrationsToInsert = data.map((registration) => {
            const registrationWithEvent = { ...registration };
            
            return toDb(registrationWithEvent) as RegistrationEvent;
          });
      
          db.transaction(() => {
            registrationsToInsert.forEach((registration) => {
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
            });
          })(); // Execute transaction
      
          return {
            success: true,
            data: `${registrationsToInsert.length} registrations created successfully.`,
          };
        } catch (error) {
          console.error("Error during creation of registrations:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error processing registrations",
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
      
      // SRC: kilde: chatgpt.com  || med endringer /
      const createByOrderId = async (order_id: string[]): Promise<Result<string>> => {
        try {
          let totalCreated = 0;
      
          for (let i = 0; i < order_id.length; i++) {
            const orderId = order_id[i];
      
            const query = db.prepare("SELECT * FROM wait_list WHERE order_id = ?");
            const registrationsData = query.all(orderId);
      
            if (registrationsData.length === 0) {
              return {
                success: false,
                error: {
                  code: "NOT_FOUND",
                  message: "No registrations found with the provided order_id",
                },
              };
            }
      
            const registrations: CreateRegistration[] = registrationsData.map((data: any) => {
              return {
                id: data.id,
                event_id: data.event_id,
                email: data.email,
                has_paid: data.has_paid,
                registration_date: data.registration_date,
                order_id: data.order_id,
              };
            });
      
            for (const registration of registrations) {
              const registrationDb = toDb(registration);
              console.log("Prepared registration data for DB insert:", registrationDb);
      
              const query = db.prepare(`
                INSERT INTO registrations (id, event_id, email, has_paid, registration_date, order_id)
                VALUES (?, ?, ?, ?, ?, ?)
              `);
      
              query.run(
                registrationDb.id,
                registrationDb.event_id,
                registrationDb.email,
                registrationDb.has_paid,
                registrationDb.registration_date,
                registrationDb.order_id
              );
      
              totalCreated++;
            }
          }
      
          return {
            success: true,
            data: `Successfully created ${totalCreated} registration(s)`,
          };
      
        } catch (error) {
          console.error("Error during creation of registration:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error during creation of registration",
            },
          };
        }
      };
      
      const deleteRegistration = async (id: string): Promise<Result<void>> => {
        try {
          const checkQuery = db.prepare("SELECT id FROM registrations WHERE id = ?");
          const exists = checkQuery.get(id);

          if (!exists) {
            return {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: "Registration not found",
              },
            };
          }

          const deleteQuery = db.prepare("DELETE FROM registrations WHERE id = ?");
          deleteQuery.run(id);

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
      
      // SRC: kilde: chatgpt.com  || med endringer /
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

      return { list, create, getRegistrationById, bookSlot, createByOrderId, deleteRegistration }
}

export const registrationRepository = createRegistrationRepository(db);

export type RegistrationRepository = ReturnType<typeof createRegistrationRepository>;