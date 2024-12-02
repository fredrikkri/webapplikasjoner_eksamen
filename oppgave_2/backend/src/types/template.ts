import { z } from 'zod';

export const TemplateSchema = z.object({
    id: z.string(),
    event_id: z.string()
})

export const TemplateCreate = TemplateSchema.omit( {
    id: true,
  })

export  type TemplateIdRow = { id: number; };
export type Template = z.infer<typeof TemplateSchema>
export type TemplateCreate = z.infer<typeof TemplateCreate>

export const validateTemplate = (data: unknown) => {
    return TemplateSchema.safeParse(data);
};

export const validateTemplateCreate = (data: unknown) => {
    return TemplateCreate.safeParse(data);
};