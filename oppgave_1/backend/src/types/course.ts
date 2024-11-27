import { z } from 'zod';
import { LessonSchema, LessonCreateSchema } from './lesson';

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  lessons: z.array(LessonSchema),
  category: z.string(),
});

export const UpdateCourseSchema = CourseSchema.omit({ lessons: true});

export const CourseCreateStepsSchema = z.object({
  id: z.string(),
  name: z.string()
})

// Modified to use LessonCreateSchema for course creation
export const CourseCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  lessons: z.array(LessonCreateSchema)
});

export const CourseArraySchema = z.array(CourseSchema)

export type CourseCreate = z.infer<typeof CourseCreateSchema>
export type CourseResponse = z.infer<typeof CourseCreateSchema>
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
export type Course = z.infer<typeof CourseSchema>
export type CourseCreateSteps = z.infer<typeof CourseCreateStepsSchema>

export const validateCourseCreateSteps = (data: unknown) => {
  return CourseCreateStepsSchema.safeParse(data);
};

export const validateCreateCourse = (data: unknown) => {
  const result = CourseCreateSchema.safeParse(data);
  if (!result.success) {
    console.error('Course validation failed:', result.error);
  }
  return result;
};

export const validateUpdateCourse = (data: unknown) => {
  return UpdateCourseSchema.safeParse(data);
};
