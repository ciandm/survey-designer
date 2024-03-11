import {z} from 'zod';

export const sortOrderEnum = z.enum(['asc', 'desc', 'random']);

export const textElementTypes = z.enum(['short_text', 'long_text']);
export const choiceElementTypes = z.enum(['multiple_choice', 'single_choice']);
export const screenElementTypes = z.enum([
  'welcome_screen',
  'thank_you_screen',
]);

export const elementTypes = z.enum([
  ...textElementTypes.options,
  ...choiceElementTypes.options,
]);

export const choicesSchema = z.array(
  z.object({
    id: z.string().min(1).max(255),
    value: z.string(),
  }),
);

const elementProperties = z.object({
  choices: choicesSchema.optional(),
  placeholder: z.string().optional(),
  allow_other_option: z.boolean().optional(),
  sort_order: sortOrderEnum.optional(),
  required_message: z.string().default('This field is required').optional(),
});

const elementValidations = z.object({
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
  properties: elementProperties,
  validations: elementValidations,
});

export const screenSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  type: screenElementTypes,
  properties: z.object({
    button_label: z.string().optional(),
  }),
});
