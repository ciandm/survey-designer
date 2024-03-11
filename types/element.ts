import {z} from 'zod';
import {
  choicesSchema,
  elementSchema,
  elementTypes,
  screenSchema,
  screenTypes,
  sortOrderEnum,
} from '@/lib/validations/element';

export type ElementSchemaType = z.infer<typeof elementSchema>;
export type ChoicesSchemaType = z.infer<typeof choicesSchema>;
export type SortOrderType = z.infer<typeof sortOrderEnum>;
export type SurveyElementType = z.infer<typeof elementTypes>;
export type ScreenSchemaType = z.infer<typeof screenSchema>;
export type ScreenElementType = z.infer<typeof screenTypes>;
export type AllElementTypes = SurveyElementType | ScreenElementType;

export type SelectedElement = {
  id: string;
  type: ElementSchemaType['type'] | ScreenSchemaType['type'];
};
