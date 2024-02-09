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
});

export const createSurveySchema = z.object({
  title: z.string(),
});

export type SurveySchema = z.infer<typeof surveySchema>;

export const updateSurveySchema = z.object({
  survey: surveySchema,
});

export const surveyResponse = z.object({
  survey: z.object({
    id: z.string(),
    schema: surveySchema,
    is_published: z.boolean(),
  }),
});

export const surveyResponsesSchema = z.array(
  z.object({
    surveyId: z.string(),
    id: z.string(),
    responses: z.array(
      z.object({
        questionId: z.string(),
        value: z.array(z.string()),
        type: z.nativeEnum(QUESTION_TYPE),
      }),
    ),
  }),
);

export const responsesSchema = z.array(
  z.object({
    questionId: z.string(),
    value: z.array(z.string()),
    type: z.nativeEnum(QUESTION_TYPE),
  }),
);

export const addOrUpdateSurveyResponseSchema = z.object({
  responseId: z.string().optional(),
  answers: responsesSchema,
});

export type SurveyResponse = z.infer<typeof surveyResponse>;
export type UpdateSurveySchema = z.infer<typeof updateSurveySchema>;
export type CreateSurveySchema = z.infer<typeof createSurveySchema>;
export type QuestionSchema = z.infer<typeof questionSchema>;
export type ChoicesSchema = z.infer<typeof choicesSchema>;
