import {FieldSchema, FieldType} from './field';
import {ScreenSchema, ScreenType} from './screen';

export type SurveyElementType = FieldType | ScreenType;
export type SurveyElementSchema = FieldSchema | ScreenSchema;

export type SelectedElement = {
  id: string;
  type: SurveyElementType;
};

export type ElementGroup = 'Text' | 'Choices' | 'Screens';

export type ElementOptions = {
  group: ElementGroup;
  options: {
    value: SurveyElementType;
    label: string;
  }[];
};
