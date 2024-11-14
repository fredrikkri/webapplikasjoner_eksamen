import { z } from 'zod';

export const CategoriesSchema = z.object({
    id: z.string(),
    name: z.string()
  })
  
  export type Categories = z.infer<typeof CategoriesSchema>

  export const validateCategories = (data: unknown) => {
    return CategoriesSchema.safeParse(data);
  };
  