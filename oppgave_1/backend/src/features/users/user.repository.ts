import { User } from "@/types/types";
import db, { DB } from "../db";
import { Result } from "@/types";
import { fromDb, toDb } from "./user.mapper";
import { CreateUser } from "@/types/user";

export const createUserRepository = (db: DB) => {

    const exist = async (id: string): Promise<boolean> => {
        const query = db.prepare(
          "SELECT COUNT(*) as count FROM users WHERE id = ?"
        );
        const data = query.get(id) as { count: number };
        return data.count > 0;
      };


      const list = async (
        query?: Record<string, string>
      ): Promise<Result<User[]>> => {
        try {
          const statement = db.prepare(`SELECT * from users`);
          const data = statement.all() as User[];
    
          return {
            success: true,
            data,
          };
        } catch (error) {

          return {
            success: false,
            error: {
              code: "SOME_CODE_HERE",
              message: "Failed getting users",
            },
          };
        }
      };
      
      const create = async (data: CreateUser): Promise<Result<string>> => {
        try {
          const userToDb = toDb(data)
    
          const query = db.prepare(`
          INSERT INTO students (id, name, email) 
          VALUES (?, ?, ?)
          `);
    

        query.run(
            userToDb.id,
            userToDb.name,
            userToDb.email
        );
    
          return {
            success: true,
            data: data.name,
          };
        } catch (error) {
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed creating user",
            },
          };
        }
      };

      const getById = async (id: string): Promise<Result<User>> => {
        try {
          const user = await exist(id);
          if (!user)
            return {
              success: false,
              error: { code: "NOT_FOUND", message: "User not found" },
            };
          const query = db.prepare("SELECT * FROM users WHERE id = ?");
          const data = query.get(id) as User;
          return {
            success: true,
            data: fromDb(data),
          };
        } catch (error) {
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Feil med henting av user",
            },
          };
        }
      };

    return { create, list, getById };
};

export const userRepository = createUserRepository(db);

export type UserRepository = ReturnType<typeof createUserRepository>;