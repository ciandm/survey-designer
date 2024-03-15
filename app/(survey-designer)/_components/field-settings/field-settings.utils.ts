import {FieldSchema} from '@/types/field';

export const getHasChoicesConfig = (field?: FieldSchema) =>
  field?.type === 'multiple_choice' || field?.type === 'single_choice';

export const getHasPlaceholder = (field?: FieldSchema) =>
  field?.type === 'short_text' || field?.type === 'long_text';
