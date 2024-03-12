import {z} from 'zod';

export const screenElementTypes = z.enum([
  'welcome_screen',
  'thank_you_screen',
]);

export const screenSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  type: screenElementTypes,
  properties: z.object({
    button_label: z.string().optional(),
  }),
});
