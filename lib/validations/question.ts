import * as z from 'zod';
import {QUESTION_TYPE} from '../constants/question';

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

export const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.nativeEnum(QUESTION_TYPE),
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

export type QuestionConfig = z.infer<typeof questionSchema>;
export type ChoicesConfig = z.infer<typeof choicesSchema>;

export const createQuestionSchema = z.object({
  type: z.nativeEnum(QUESTION_TYPE),
});

export const duplicateQuestionSchema = z.object({
  id: z.string(),
});

export const deleteQuestionSchema = z.object({
  id: z.string(),
});

export type CreateQuestionPayload = z.infer<typeof createQuestionSchema>;
export type DeleteQuestionPayload = z.infer<typeof deleteQuestionSchema>;
export type DuplicateQuestionPayload = z.infer<typeof duplicateQuestionSchema>;
