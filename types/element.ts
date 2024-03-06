import {z} from 'zod';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {
  choicesSchema,
  elementSchema,
  sortOrderEnum,
} from '@/lib/validations/element';

export type ElementSchemaType = z.infer<typeof elementSchema>;
export type ChoicesSchemaType = z.infer<typeof choicesSchema>;
export type SortOrderType = z.infer<typeof sortOrderEnum>;
export type SurveyElementType = keyof typeof ELEMENT_TYPE;
