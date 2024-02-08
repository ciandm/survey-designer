import * as z from 'zod';
import {QUESTION_TYPE} from '../constants/question';
import {questionSchema} from './question';

export const deleteSurveySchema = z.object({
  id: z.number(),
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

export const addOrUpdateSurveyResponseSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.array(z.string()),
      type: z.nativeEnum(QUESTION_TYPE),
    }),
  ),
});

export type SurveyResponse = z.infer<typeof surveyResponse>;
export type UpdateSurveySchema = z.infer<typeof updateSurveySchema>;
export type CreateSurveySchema = z.infer<typeof createSurveySchema>;
