import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z.string().trim().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
