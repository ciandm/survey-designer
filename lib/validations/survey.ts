import * as z from 'zod';
import {FieldSchema} from '@/types/field';
import {fieldSchema, fieldTypes} from './field';
import {screenSchema} from './screen';

export const modelSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(fieldSchema),
  screens: z.object({
    welcome: z.array(screenSchema),
    thank_you: z.array(screenSchema),
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
  type: fieldTypes,
});

export const responsesSchema = z.array(responseSchema);

export const saveResponsesInput = z.object({
  responses: z.array(responseSchema),
  surveyId: z.string(),
});

export const createSingleStepValidationSchema = (fields: FieldSchema[]) => {
  return z
    .object({
      questionId: z.string(),
      value: z.array(z.string()),
      type: fieldTypes,
    })
    .superRefine(({questionId, type, value}, ctx) => {
      const element = fields.find((el) => el.id === questionId);

      if (!element) {
        return ctx.addIssue({
          message: 'Element not found',
          path: ['questionId'],
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        element.validations.required &&
        (!value.length || value[0].length === 0)
      ) {
        return ctx.addIssue({
          message:
            element.properties.required_message || 'This field is required',
          path: ['value'],
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        element.type === 'multiple_choice' &&
        element.validations.min_selections &&
        value.length < element.validations.min_selections
      ) {
        return ctx.addIssue({
          message: `Select at least ${element.validations.min_selections} options`,
          path: ['value'],
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        element.type === 'multiple_choice' &&
        element.validations.max_selections &&
        value.length > element.validations.max_selections
      ) {
        return ctx.addIssue({
          message: `Select at most ${element.validations.max_selections} options`,
          path: ['value'],
          code: z.ZodIssueCode.custom,
        });
      }

      return ctx;
    });
};
