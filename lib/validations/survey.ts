import * as z from 'zod';
import {ElementSchemaType} from '@/types/element';
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

export const saveResponsesInput = z.object({
  responses: z.array(responseSchema),
  surveyId: z.string(),
});

export const createSingleStepValidationSchema = (
  elements: ElementSchemaType[],
) => {
  return z
    .object({
      questionId: z.string(),
      value: z.array(z.string()),
      type: z.nativeEnum(ELEMENT_TYPE),
    })
    .superRefine(({questionId, type, value}, ctx) => {
      const element = elements.find((el) => el.id === questionId);

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

      return ctx;
    });
};

export const createMultiValidationSchema = (elements: ElementSchemaType[]) => {
  return z
    .object({
      fields: z.array(
        z.object({
          questionId: z.string(),
          value: z.array(z.string()),
          type: z.nativeEnum(ELEMENT_TYPE),
        }),
      ),
    })
    .superRefine(({fields}, ctx) => {
      fields.forEach((field, index) => {
        const element = elements[index];

        if (
          element.validations.required &&
          (!field.value.length || field.value[0].length === 0)
        ) {
          return ctx.addIssue({
            message:
              element.properties.required_message || 'This field is required',
            path: ['fields', index, 'value'],
            code: z.ZodIssueCode.custom,
          });
        }
      });

      return ctx;
    });
};
