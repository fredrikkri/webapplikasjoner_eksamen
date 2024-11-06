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

// SRC: kilde: chatgpt.com /
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// SRC: kilde: chatgpt.com /
export const CommentSchema = z.object({
  id: z.string(),
  createdBy: UserSchema,
  comment: z.string(),
  lesson: z.object({
    slug: z.string(),
  }),
});

export const CourseCreateStepsSchema = z.object({
  id: z.string(),
  name: z.string()
})

export const CategoriesSchema = z.object({
  id: z.string(),
  name: z.string()
})

export const CourseCreateSchema = CourseSchema.omit( {id: true} )
export const CourseArraySchema = z.array(CourseSchema)

// SRC: kilde: chatgpt.com || .extend/
export const LessonCreateSchema = LessonSchema.omit({ id: true, slug: true,})
  .extend({text: z.array(z.object({id: z.string(),}))});
export const LessonArraySchema = z.array(LessonSchema);

export const CommentCreateSchema = CommentSchema.omit({ id: true });
export const CommentArraySchema = z.array(CommentSchema);

export type Lesson = z.infer<typeof LessonSchema>;
export type CreateLesson = z.infer<typeof LessonCreateSchema>;

export type CreateComment = z.infer<typeof CommentCreateSchema>;
export type Comment = z.infer<typeof CommentSchema>

export type CourseCreate = z.infer<typeof CourseCreateSchema>
export type CourseResponse = z.infer<typeof CourseCreateSchema>
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
export type Course = z.infer<typeof CourseSchema>

export type User = z.infer<typeof UserSchema>;
export type CourseCreateSteps = z.infer<typeof CourseCreateStepsSchema>
export type Categories = z.infer<typeof CategoriesSchema>



export const validateCreateCourse = (data: unknown) => {
  return CourseCreateSchema.safeParse(data);
};

export const validateCreateComment = (data: unknown) => {
  return CommentCreateSchema.safeParse(data);
};

export const validateUpdateCourse = (data: unknown) => {
  return CourseSchema.safeParse(data);
};

export const validateCategories = (data: unknown) => {
  return CategoriesSchema.safeParse(data);
};

export const validateCourseCreateSteps = (data: unknown) => {
  return CourseCreateStepsSchema.safeParse(data);
};
