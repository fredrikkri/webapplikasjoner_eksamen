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
