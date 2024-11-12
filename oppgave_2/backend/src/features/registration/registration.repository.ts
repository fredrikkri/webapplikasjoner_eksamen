import { Result } from "@/types";
import db, { DB } from "../db";
import { Registration } from "@/types/registration";


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

      

      return { list }
}

export const registrationRepository = createRegistrationRepository(db);

export type RegistrationRepository = ReturnType<typeof createRegistrationRepository>;