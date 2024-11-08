import type { Result } from "@/types";
import { createCategoryResponse } from "./category.mapper";
import type { Query } from "@/lib/query";
import { createCategoryRepository, CategoryRepository, categoryRepository } from "./category.repository";
import { Categories, validateCategories } from "../../types/category";

export const createCategoryService = (categoryRepository: CategoryRepository) => {

  const getById = async (id: string): Promise<Result<Categories>> => {
    return categoryRepository.getById(id);
  };

  const list = async (query?: Query): Promise<Result<Categories[]>> => {
    const result = await categoryRepository.list(query);
    if (!result.success) return result;

    return {
      ...result,
      data: result.data.map(createCategoryResponse),
    };
  };

  return {
    list,
    getById
  };
};

export const categoryService = createCategoryService(categoryRepository);

export type CategoryService = ReturnType<typeof createCategoryRepository>;