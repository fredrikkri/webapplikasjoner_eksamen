import { Result } from "@/types";
import db, { DB } from "../db";
import { CreateRegistration, Registration } from "@/types/registration";
import { toDb } from "./registration.mapper";


export const createRegistrationRepository = (db: DB) => {

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

      

      return { list, create }
}

export const registrationRepository = createRegistrationRepository(db);

export type RegistrationRepository = ReturnType<typeof createRegistrationRepository>;