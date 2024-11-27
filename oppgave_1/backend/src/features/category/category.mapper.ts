import { Categories } from "../../types/category";
import { createId } from "../../util/utils";

export const createCategoryResponse = (data: Categories): Categories => {
  const validation = validateCategory(data);
  if (!validation.success) {
    return {
      id: createId(),
      name: "unknown"
    };
  }
  
  return {
    id: data.id || createId(),
    name: data.name
  };
};

export const fromDb = (data: Categories): Categories => {
  return {
    id: data.id ?? createId(),  
    name: data?.name ?? "unknown"
  };
};

function validateCategory(data: unknown): { success: boolean, data?: Categories } {
  if (!data || typeof data !== 'object') {
    return { success: false };
  }

  const category = data as Categories;
  if (!category.name || typeof category.name !== 'string') {
    return { success: false };
  }

  return {
    success: true,
    data: {
      id: category.id || createId(),
      name: category.name
    }
  };
}