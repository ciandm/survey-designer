import {z} from 'zod';

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

export const screenTypes = z.enum(['welcome_screen', 'thank_you_screen']);

export const sortOrderEnum = z.enum(['asc', 'desc', 'random']);

export const elementTypes = z.enum([
  'short_text',
  'long_text',
  'multiple_choice',
  'single_choice',
  'number',
  'date',
  'time',
  'email',
  'phone',
  'website',
  'address',
  'rating',
  'image',
  'file',
  'statement',
  'section',
]);

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
  type: elementTypes,
  description: z.string().optional(),
  ref: z.string(),
  properties,
  validations,
});

export const screenSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  type: screenTypes,
  properties: z.object({
    button_label: z.string().nullable(),
  }),
});
