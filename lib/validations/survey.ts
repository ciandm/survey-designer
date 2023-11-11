import * as z from 'zod';
import {questionSchema} from './question';

export const deleteSurveySchema = z.object({
  id: z.number(),
});

export const surveySchema = z.object({
  id: z.string().readonly(),
  title: z.string(),
  questions: z.array(questionSchema),
});

export type SurveySchema = z.infer<typeof surveySchema>;

export const surveySchemaUpdate = z.object({
  survey: surveySchema,
});

export const surveyResponse = z.object({
  survey: z.object({
    id: z.string(),
    schema: surveySchema,
  }),
});

export type SurveyResponse = z.infer<typeof surveyResponse>;
export type SurveySchemaUpdate = z.infer<typeof surveySchemaUpdate>;
