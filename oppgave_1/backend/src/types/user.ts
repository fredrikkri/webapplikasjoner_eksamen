import { z } from 'zod';

// SRC: kilde: chatgpt.com /
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  });

  export type User = z.infer<typeof UserSchema>;