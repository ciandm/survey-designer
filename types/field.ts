import {z} from 'zod';
import {
  choicesSchema,
  fieldSchema,
  fieldTypes,
  sortOrderEnum,
} from '@/lib/validations/field';

export type FieldType = z.infer<typeof fieldTypes>;
export type FieldSchema = z.infer<typeof fieldSchema>;

export type ChoicesSchema = z.infer<typeof choicesSchema>;
export type ChoicesSortOrder = z.infer<typeof sortOrderEnum>;
