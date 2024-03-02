import * as z from 'zod';
import {ELEMENT_TYPE} from '../constants/element';
import {elementSchema} from './element';

export const screenSchema = z.object({
  message: z.string().nullable(),
});

export const modelSchema = z.object({
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

export const updateModelInput = z.object({
  id: z.string().min(1),
  model: modelSchema,
});

export const deleteSurveyInput = publishSurveyInput.pick({surveyId: true});

export const responseSchema = z.object({
  questionId: z.string(),
  value: z.array(z.string()),
  type: z.nativeEnum(ELEMENT_TYPE),
});

export const responsesSchema = z.array(responseSchema);

export const createResponseInput = z.object({
  responses: z.array(responseSchema),
});
