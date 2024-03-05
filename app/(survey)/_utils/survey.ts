import {z} from 'zod';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {ElementSchemaType} from '@/types/element';

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

export const createSurveyValidationSchema = (elements: ElementSchemaType[]) => {
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
