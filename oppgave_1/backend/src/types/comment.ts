import { z } from 'zod';
import { UserSchema } from './user';

export const CommentSchema = z.object({
    id: z.string(),
    createdBy: UserSchema,
    comment: z.string(),
    lesson: z.object({
      id: z.string(),
    }),
  });

export const CommentCreateSchema = CommentSchema.omit({ id: true });
export const CommentArraySchema = z.array(CommentSchema);
export type CreateComment = z.infer<typeof CommentCreateSchema>;
export type Comment = z.infer<typeof CommentSchema>

export const validateCreateComment = (data: unknown) => {
    return CommentCreateSchema.safeParse(data);
  };

export const validateComment = (data: unknown) => {
    return CommentSchema.safeParse(data);
  };
