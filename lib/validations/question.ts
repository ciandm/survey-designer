import {QuestionType} from '@prisma/client';
import * as z from 'zod';

export const questionDesignSchema = z.object({
  text: z
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
      id: z.string().min(1).max(255),
      value: z.string().min(1).max(255),
      label: z.string().min(1).max(255),
    }),
  ),
});

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.nativeEnum(QuestionType),
  description: z.string().optional(),
  ref: z.string(),
  properties: z.object({
    choices: choicesSchema.optional(),
    placeholder: z.string().optional(),
    allow_other_option: z.boolean().optional(),
    allow_multiple_selection: z.boolean().optional(),
    randomise: z.boolean().optional(),
  }),
  validations: z.object({
    required: z.boolean().optional(),
    min_characters: z.number().optional(),
    max_characters: z.number().optional(),
  }),
});

export const configurationSchema = z.object({
  id: z.string(),
  name: z.string(),
  fields: z.array(questionSchema),
});

export type Configuration = z.infer<typeof configurationSchema>;
export type QuestionConfig = z.infer<typeof questionSchema>;
export type ChoicesConfig = z.infer<typeof choicesSchema>;
