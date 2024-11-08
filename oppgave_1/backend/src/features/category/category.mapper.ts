import { Categories } from "@/types/category";
import { createId } from "@/util/utils";



export const createCategoryResponse = (data: Categories): Categories => {
  const { name } = data;
    
  return {
    ...data,
    name
    };
};

export const fromDb = (data: Categories) => {
    return {
      id: data.id ?? createId(),  
      name: data?.name ?? "unknown"
    };
};

