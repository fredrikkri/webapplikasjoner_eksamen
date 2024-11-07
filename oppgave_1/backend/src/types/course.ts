import { z } from 'zod';
import { LessonSchema } from './lesson';

// SRC: kilde: chatgpt.com /
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  lessons: z.array(LessonSchema),
  category: z.string(),
});

export const UpdateCourseSchema = CourseSchema.omit({
});

export const CourseCreateStepsSchema = z.object({
  id: z.string(),
  name: z.string()
})

export const CourseCreateSchema = CourseSchema.omit( {id: true} )
export const CourseArraySchema = z.array(CourseSchema)

export type CourseCreate = z.infer<typeof CourseCreateSchema>
export type CourseResponse = z.infer<typeof CourseCreateSchema>
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
export type Course = z.infer<typeof CourseSchema>

export const validateCourseCreateSteps = (data: unknown) => {
  return CourseCreateStepsSchema.safeParse(data);
};

export const validateCreateCourse = (data: unknown) => {
  return CourseCreateSchema.safeParse(data);
};

export type CourseCreateSteps = z.infer<typeof CourseCreateStepsSchema>

export const validateUpdateCourse = (data: unknown) => {
  return CourseSchema.safeParse(data);
};
