import { Categories } from "@/types/category";


const createId = () => {
    return crypto.randomUUID();
  };

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

