import { Result } from "@/types";
import { DB } from "../db";
import { Registration } from "@/types/registration";


export const createRegistrationRepository = (db: DB) => {

    const eventExist = async (id: string): Promise<boolean> => {
        const query = db.prepare(
          "SELECT COUNT(*) as count FROM event WHERE id = ?"
        );
        const data = query.get(id) as { count: number };
        return data.count > 0;
      };

      const list = async (
        query?: Record<string, string>
      ): Promise<Result<Registration[]>> => {
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

      return { list}

}