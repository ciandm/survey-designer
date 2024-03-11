import {v4 as uuidv4} from 'uuid';
import {elementTypes} from '@/lib/validations/element';
import type {
  ElementSchemaType,
  ScreenElementType,
  ScreenSchemaType,
  SurveyElementType,
} from '@/types/element';
import {ParsedModelType, SurveyFormConfig} from '@/types/survey';

export function formatQuestionType(type: SurveyElementType): string {
  switch (type) {
    case 'short_text':
      return 'Short Text';
    case 'long_text':
      return 'Long Text';
    case 'multiple_choice':
      return 'Multiple Choice';
    case 'single_choice':
      return 'Single Choice';
    default:
      return '';
  }
}

export function buildNewElementHelper(
  type: SurveyElementType,
  field: Partial<ElementSchemaType>,
): ElementSchemaType {
  switch (type) {
    case 'long_text':
    case 'short_text':
      return {
        id: field?.id ?? uuidv4(),
        ref: field?.ref ?? uuidv4(),
        text: field?.text ?? '',
        description: field?.description ?? '',
        type,
        properties: {
          placeholder: '',
          choices: [],
        },
        validations: {
          required: field.validations?.required || false,
        },
      };

    case 'multiple_choice':
    case 'single_choice':
      return {
        id: field?.id ?? uuidv4(),
        ref: field?.ref ?? uuidv4(),
        text: field?.text ?? '',
        description: field?.description ?? '',
        type,
        properties: {
          choices: field.properties?.choices?.length
            ? field.properties.choices
            : [
                {
                  id: uuidv4(),
                  value: '',
                },
              ],
        },
        validations: {
          required: field.validations?.required || false,
        },
      };
    default:
      throw new Error('Invalid field type');
  }
}

export function validateIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export const buildSurveyConfig = (model: ParsedModelType): SurveyFormConfig => {
  const {elements = []} = model;
  const config: SurveyFormConfig = {};
  if (!elements.length) return config;

  elements.forEach((el, index) => {
    const nextElement = model.elements[index + 1];
    const previousElement = model.elements[index - 1];
    config[el.id] = {
      next: nextElement?.id || 'complete',
      previous: previousElement?.id || null,
    };
  });
  return config;
};

export const getIsElementType = (
  type?: SurveyElementType | ScreenElementType,
): type is SurveyElementType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen' || !type)
    return false;
  const options = elementTypes.options;
  return options.includes(type);
};

export const getIsScreenType = (
  type?: SurveyElementType | ScreenElementType,
): type is ScreenElementType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen') return true;
  return false;
};

export const getIsElementSchema = (
  element: ElementSchemaType | ScreenSchemaType,
): element is ElementSchemaType => getIsElementType(element.type);

export const getIsScreenSchema = (
  element: ElementSchemaType | ScreenSchemaType,
): element is ScreenSchemaType => getIsScreenType(element.type);
