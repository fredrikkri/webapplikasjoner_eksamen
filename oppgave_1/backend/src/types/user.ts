import { z } from 'zod';

// SRC: kilde: chatgpt.com /
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  });

  export const createUserSchema = UserSchema.omit({
    id: true,
  });

  export type User = z.infer<typeof UserSchema>;
  export type CreateUser = z.infer<typeof createUserSchema>;

  export const validateCreateUser = (data: unknown) => {
    return createUserSchema.safeParse(data);
  };
