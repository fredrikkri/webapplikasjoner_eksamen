import { z } from 'zod';

export const CourseCreateStepsSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  export const CreateCourseCreateStepsSchema = CourseCreateStepsSchema.omit( {id: true} )
  export type CourseCreateStepsResponse = z.infer<typeof CourseCreateStepsSchema>
  export type CourseCreateSteps = z.infer<typeof CourseCreateStepsSchema>