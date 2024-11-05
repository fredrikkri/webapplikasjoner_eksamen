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


export const LessonCreateSchema = LessonSchema.omit({ id: true, slug: true,})
  .extend({text: z.array(z.object({id: z.string(),}))});
export const LessonArraySchema = z.array(LessonSchema);
export type Lesson = z.infer<typeof LessonSchema>;
export type CreateLesson = z.infer<typeof LessonCreateSchema>;

export const CommentCreateSchema = CommentSchema.omit({ id: true });
export const CommentArraySchema = z.array(CommentSchema);
export type CreateComment = z.infer<typeof CommentCreateSchema>;
export type Comment = z.infer<typeof CommentSchema>

export const CourseCreateSchema = CourseSchema.omit( {id: true} )
export const CourseArraySchema = z.array(CourseSchema)
export type CourseCreate = z.infer<typeof CourseCreateSchema>
export type Course = z.infer<typeof CourseSchema>

export type User = z.infer<typeof UserSchema>;


