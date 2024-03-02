import {z} from 'zod';
import {
  choicesSchema,
  elementSchema,
  SORT_ORDER,
} from '@/lib/validations/element';

export type ElementSchemaType = z.infer<typeof elementSchema>;
export type ChoicesSchemaType = z.infer<typeof choicesSchema>;
export type SortOrderType = z.infer<typeof SORT_ORDER>;
