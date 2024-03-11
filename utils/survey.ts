import {generateId} from 'lucia';
import {v4 as uuidv4} from 'uuid';
import {elementTypes} from '@/lib/validations/element';
import type {
  ElementSchema,
  ElementType,
  ScreenSchema,
  ScreenType,
} from '@/types/element';
import {ParsedModelType, SurveyFormConfig} from '@/types/survey';

export function formatQuestionType(type: ElementType): string {
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
  type: ElementType,
  field: Partial<ElementSchema>,
): ElementSchema {
  switch (type) {
    case 'long_text':
    case 'short_text':
      return {
        id: `el_${generateId(12)}`,
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

export function buildNewScreenHelper(type: ScreenType): ScreenSchema {
  switch (type) {
    case 'welcome_screen':
      return {
        id: `sc_${generateId(12)}`,
        type,
        text: 'Welcome to the survey!',
        description: '',
        properties: {
          button_label: 'Start survey',
        },
      };
    case 'thank_you_screen':
      return {
        id: `sc_${generateId(12)}`,
        type,
        text: 'Thank you for completing the survey!',
        description: '',
        properties: {
          button_label: 'Submit',
        },
      };
    default:
      throw new Error('Invalid screen type');
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
  type?: ElementType | ScreenType,
): type is ElementType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen' || !type)
    return false;
  const options = elementTypes.options;
  return options.includes(type);
};

export const getIsScreenType = (
  type?: ElementType | ScreenType,
): type is ScreenType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen') return true;
  return false;
};

export const getIsElementSchema = (
  element: ElementSchema | ScreenSchema,
): element is ElementSchema => getIsElementType(element.type);

export const getIsScreenSchema = (
  element: ElementSchema | ScreenSchema,
): element is ScreenSchema => getIsScreenType(element.type);
