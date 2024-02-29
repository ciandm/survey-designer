import {Prisma, Survey} from '@prisma/client';
import * as z from 'zod';
import {ELEMENT_TYPE} from '../constants/element';

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

export const SORT_ORDER = z.enum(['asc', 'desc', 'random']);

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
    sort_order: SORT_ORDER.optional(),
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

export const screenSchema = z.object({
  message: z.string().nullable(),
});

export const surveySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  elements: z.array(elementSchema),
  screens: z.object({
    welcome: screenSchema,
    thank_you: screenSchema,
  }),
  version: z.number().default(1),
});

export const createSurveyInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duplicatedFrom: z.string().optional(),
});

export const publishSurveyInput = z.object({
  surveyId: z.string().min(1),
  action: z.enum(['publish', 'unpublish']),
});

export const deleteSurveyInput = publishSurveyInput.pick({surveyId: true});

export type SurveySchema = z.infer<typeof surveySchema>;

export const updateSurveyInput = z.object({});

export const updateSchemaInput = z.object({
  schema: surveySchema,
});

export const surveyResponse = z.object({
  survey: z.object({
    id: z.string(),
    schema: surveySchema,
    is_published: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
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

export type SurveyWithParsedSchema = Omit<Survey, 'schema'> & {
  schema: SurveySchema;
};
export type SurveyResponse = z.infer<typeof surveyResponse>;
export type UpdateSurveySchema = z.infer<typeof updateSchemaInput>;
export type CreateSurveyInput = z.infer<typeof createSurveyInput>;
export type ElementSchema = z.infer<typeof elementSchema>;
export type ChoicesSchema = z.infer<typeof choicesSchema>;
export type ResponseSchema = z.infer<typeof responseSchema>;
export type SortOrder = z.infer<typeof SORT_ORDER>;

export type WithParsedSchema<T> = T extends {schema: any}
  ? {schema: SurveySchema} & Omit<T, 'schema'>
  : never;
