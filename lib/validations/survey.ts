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
  questions: z.array(questionSchema),
  welcome_screen: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
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
  type: z.nativeEnum(QUESTION_TYPE),
});

export const surveyResponsesSchema = z.array(
  z.object({
    surveyId: z.string(),
    id: z.string(),
    responses: z.array(responseSchema),
  }),
);

export const createResponseInput = z.object({
  responses: z.array(responseSchema),
});

export type SurveyResponse = z.infer<typeof surveyResponse>;
export type UpdateSurveySchema = z.infer<typeof updateSurveyInput>;
export type CreateSurveySchema = z.infer<typeof createSurveyInput>;
export type QuestionSchema = z.infer<typeof questionSchema>;
export type ChoicesSchema = z.infer<typeof choicesSchema>;
export type SurveyResponseSchema = z.infer<
  typeof surveyResponsesSchema
>[number];
export type ResponseSchema = SurveyResponseSchema['responses'][number];
