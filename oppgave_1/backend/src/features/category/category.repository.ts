import db, { DB } from "../db";
import { Result } from "../../types";
import { fromDb } from "./category.mapper";
import { Categories } from "../../types/category";

export const createCategoryRepository = (db: DB) => {
    const exist = async (id: string): Promise<boolean> => {
        const query = db.prepare(
          "SELECT COUNT(*) as count FROM categories WHERE id = ?"
        );
        const data = query.get(id) as { count: number };
        return data.count > 0;
    };

    const list = async (
        query?: Record<string, string>
    ): Promise<Result<Categories[]>> => {
        try {
            const statement = db.prepare(`SELECT * from categories`);
            const rawData = statement.all() as Categories[];
            const data = rawData.map(category => fromDb(category));
    
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error in category repository list:', error);
            return {
                success: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed getting categories",
                },
            };
        }
    };
      
    const getById = async (id: string): Promise<Result<Categories>> => {
        try {
            const category = await exist(id);
            if (!category)
                return {
                    success: false,
                    error: { code: "NOT_FOUND", message: "Category not found" },
                };
            const query = db.prepare("SELECT * FROM categories WHERE id = ?");
            const data = query.get(id) as Categories;
            return {
                success: true,
                data: fromDb(data),
            };
        } catch (error) {
            console.error('Error in category repository getById:', error);
            return {
                success: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed getting category",
                },
            };
        }
    };

    return { list, getById };
};

export const categoryRepository = createCategoryRepository(db);

export type CategoryRepository = ReturnType<typeof createCategoryRepository>;