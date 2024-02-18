import * as z from 'zod';
import {ELEMENT_TYPE} from '../constants/element';

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

export const elementSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.nativeEnum(ELEMENT_TYPE),
  description: z.string().optional(),
  ref: z.string(),
  properties: z.object({
    choices: choicesSchema.optional(),
    placeholder: z.string().optional(),
    allow_other_option: z.boolean().optional(),
    sort_order: z.enum(['asc', 'desc', 'random']).optional(),
    required_message: z.string().default('This field is required').optional(),
  }),
  validations: z.object({
    required: z.boolean().default(false).optional(),
    min_characters: z.number().optional(),
    max_characters: z.number().optional(),
    min_selections: z.number().optional(),
    max_selections: z.number().optional(),
  }),
});

export const surveySchema = z.object({
  id: z.string(),
  title: z.string(),
  elements: z.array(elementSchema),
  version: z.number().default(1),
});

export const createSurveyInput = z.object({
  title: z.string(),
});

export type SurveySchema = z.infer<typeof surveySchema>;

export const updateSurveyInput = z.object({
  survey: surveySchema,
});

export const surveyResponse = z.object({
  survey: z.object({
    id: z.string(),
    schema: surveySchema,
    is_published: z.boolean(),
  }),
});

export const responseSchema = z.object({
  questionId: z.string(),
  value: z.array(z.string()),
  type: z.nativeEnum(ELEMENT_TYPE),
});

export const responsesSchema = z.array(responseSchema);

export const createResponseInput = z.object({
  responses: z.array(responseSchema),
});

export type SurveyResponse = z.infer<typeof surveyResponse>;
export type UpdateSurveySchema = z.infer<typeof updateSurveyInput>;
export type CreateSurveySchema = z.infer<typeof createSurveyInput>;
export type ElementSchema = z.infer<typeof elementSchema>;
export type ChoicesSchema = z.infer<typeof choicesSchema>;
export type ResponseSchema = z.infer<typeof responseSchema>;
