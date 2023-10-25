import {QuestionType} from '@prisma/client';
import * as z from 'zod';

export const questionDesignSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title must be at least 1 character long',
    })
    .max(255),
  description: z.string().max(255).optional(),
  type: z.nativeEnum(QuestionType),
  config: z.object({
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    skippable: z.boolean().optional(),
  }),
  choices: z.array(
    z.object({
      value: z.string().min(1).max(255),
    }),
  ),
});
