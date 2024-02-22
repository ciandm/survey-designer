import {z} from 'zod';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {ElementSchema} from '@/lib/validations/survey';

export const createSurveyValidationSchema = (elements: ElementSchema[]) => {
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
