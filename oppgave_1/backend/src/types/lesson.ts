import { z } from 'zod';

// SRC: kilde: chatgpt.com /
export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  preAmble: z.string(),
  text: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
});

// SRC: kilde: chatgpt.com || .extend/
export const LessonCreateSchema = LessonSchema.omit({ id: true, slug: true,})
  .extend({text: z.array(z.object({id: z.string(),}))});
export const UpdateLessonSchema = LessonSchema.partial();

export const LessonArraySchema = z.array(LessonSchema);

// Types for lessons
export type Lesson = z.infer<typeof LessonSchema>;
export type CreateLesson = z.infer<typeof LessonCreateSchema>;
export type UpdateLesson = z.infer<typeof UpdateLessonSchema>;

export const validateCreateLesson = (data: unknown) => {
  return LessonCreateSchema.safeParse(data);
};

export const validateUpdateLesson = (data: unknown) => {
  return UpdateLessonSchema.safeParse(data);
};