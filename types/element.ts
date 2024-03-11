import {z} from 'zod';
import {
  choicesSchema,
  elementSchema,
  elementTypes,
  screenSchema,
  screenTypes,
  sortOrderEnum,
} from '@/lib/validations/element';

export type ChoicesSchema = z.infer<typeof choicesSchema>;
export type ChoicesSortOrder = z.infer<typeof sortOrderEnum>;

export type ElementType = z.infer<typeof elementTypes>;
export type ScreenType = z.infer<typeof screenTypes>;

export type ElementSchema = z.infer<typeof elementSchema>;
export type ScreenSchema = z.infer<typeof screenSchema>;

export type SurveyElementTypes = ElementType | ScreenType;

export type SelectedElement = {
  id: string;
  type: SurveyElementTypes;
};
