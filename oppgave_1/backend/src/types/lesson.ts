import { z } from 'zod';

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  preAmble: z.string(),
  course_id: z.string().optional(), // Added course_id as optional since it's set during creation
  text: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
});

export const LessonCreateSchema = LessonSchema.omit({ id: true, slug: true, course_id: true });

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

const validateLesson = (lessonData: any) => {
  return LessonSchema.parse(lessonData);
};
