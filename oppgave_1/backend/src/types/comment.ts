import { z } from 'zod';
import { UserSchema } from './user';

// SRC: kilde: chatgpt.com /
export const CommentSchema = z.object({
    id: z.string(),
    createdBy: UserSchema,
    comment: z.string(),
    lesson: z.object({
      slug: z.string(),
    }),
  });

export const CommentCreateSchema = CommentSchema.omit({ id: true });
export const CommentArraySchema = z.array(CommentSchema);
export type CreateComment = z.infer<typeof CommentCreateSchema>;
export type Comment = z.infer<typeof CommentSchema>

export const validateCreateComment = (data: unknown) => {
    return CommentCreateSchema.safeParse(data);
  };