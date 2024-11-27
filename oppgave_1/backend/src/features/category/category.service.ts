import type { Result } from "../../types";
import { createCategoryResponse } from "./category.mapper";
import type { Query } from "../../lib/query";
import { createCategoryRepository, CategoryRepository, categoryRepository } from "./category.repository";
import { Categories, validateCategories } from "../../types/category";

export const createCategoryService = (categoryRepository: CategoryRepository) => {
  const getById = async (id: string): Promise<Result<Categories>> => {
    try {
      const result = await categoryRepository.getById(id);
      if (!result.success) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Category not found"
          }
        };
      }

      return {
        success: true,
        data: createCategoryResponse(result.data)
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get category"
        }
      };
    }
  };

  const list = async (query?: Query): Promise<Result<Categories[]>> => {
    try {
      const result = await categoryRepository.list(query);
      if (!result.success) {
        return {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to list categories"
          }
        };
      }

      const categories = result.data.map(createCategoryResponse);
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error("Error in category service list:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list categories"
        }
      };
    }
  };

  return {
    list,
    getById
  };
};

export const categoryService = createCategoryService(categoryRepository);

export type CategoryService = ReturnType<typeof createCategoryService>;