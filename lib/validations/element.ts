import {z} from 'zod';
import {ELEMENT_TYPE} from '../constants/element';

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

export const sortOrderEnum = z.enum(['asc', 'desc', 'random']);

const properties = z.object({
  choices: choicesSchema.optional(),
  placeholder: z.string().optional(),
  allow_other_option: z.boolean().optional(),
  sort_order: sortOrderEnum.optional(),
  required_message: z.string().default('This field is required').optional(),
});

const validations = z.object({
  required: z.boolean().default(false).optional(),
  min_characters: z.number().optional(),
  max_characters: z.number().optional(),
  min_selections: z.number().optional(),
  max_selections: z.number().optional(),
});

export const elementSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.nativeEnum(ELEMENT_TYPE),
  description: z.string().optional(),
  ref: z.string(),
  properties,
  validations,
});
