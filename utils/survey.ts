import {generateId} from 'lucia';
import {v4 as uuidv4} from 'uuid';
import {fieldTypes} from '@/lib/validations/field';
import {SurveyElementType} from '@/types/element';
import type {FieldSchema, FieldType} from '@/types/field';
import {ScreenSchema, ScreenType} from '@/types/screen';
import {ResponseType, SurveyResponsesMap} from '@/types/survey';
import {
  CreateSurveyInputType,
  ParsedModelType,
  SurveyFormConfig,
  SurveyWithParsedModelType,
} from '@/types/survey';

export function formatElementType(type: SurveyElementType): string {
  switch (type) {
    case 'short_text':
      return 'Short text';
    case 'long_text':
      return 'Long text';
    case 'multiple_choice':
      return 'Multiple choice';
    case 'single_choice':
      return 'Single choice';
    case 'thank_you_screen':
      return 'Thank you screen';
    case 'welcome_screen':
      return 'Welcome screen';
    default:
      return '';
  }
}

export function buildNewFieldHelper(
  type: FieldType,
  field: Partial<FieldSchema>,
): FieldSchema {
  const baseField = {
    id: field?.id ?? generateId(15),
    ref: field?.ref ?? generateId(15),
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
  switch (type) {
    case 'long_text':
    case 'short_text':
      return {
        ...baseField,
        properties: {
          ...baseField.properties,
          placeholder: field.properties?.placeholder || 'Your answer here',
        },
        validations: {
          ...baseField.validations,
          min_characters: field.validations?.min_characters || 0,
          max_characters: field.validations?.max_characters || 0,
        },
      };

    case 'multiple_choice':
    case 'single_choice':
      return {
        ...baseField,
        properties: {
          ...baseField.properties,
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
          ...baseField.validations,
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
        id: generateId(15),
        type,
        text: 'Welcome to the survey!',
        description: '',
        properties: {
          button_label: 'Start survey',
        },
      };
    case 'thank_you_screen':
      return {
        id: generateId(15),
        type,
        text: 'Thank you for completing the survey!',
        description: '',
        properties: {},
      };
    default:
      throw new Error('Invalid screen type');
  }
}

export function validateIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export const buildSurveyConfig = (model: ParsedModelType): SurveyFormConfig => {
  const {fields = []} = model;
  const config: SurveyFormConfig = {};
  if (!fields.length) return config;

  fields.forEach((el, index) => {
    const nextElement = model.fields[index + 1];
    const previousElement = model.fields[index - 1];
    config[el.id] = {
      next: nextElement?.id || 'complete',
      previous: previousElement?.id || null,
    };
  });
  return config;
};

export const getIsFieldType = (
  type?: FieldType | ScreenType,
): type is FieldType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen' || !type)
    return false;
  const options = fieldTypes.options;
  return options.includes(type);
};

export const getIsScreenType = (
  type?: FieldType | ScreenType,
): type is ScreenType => {
  if (type === 'welcome_screen' || type === 'thank_you_screen') return true;
  return false;
};

export const getIsField = (
  element: FieldSchema | ScreenSchema | null,
): element is FieldSchema => getIsFieldType(element?.type);

export const getIsScreen = (
  element: FieldSchema | ScreenSchema | null,
): element is ScreenSchema => getIsScreenType(element?.type);

function duplicateElements(fields: FieldSchema[]) {
  return fields.map((element) => ({
    ...element,
    id: uuidv4(),
    ref: uuidv4(),
    properties: {
      ...element.properties,
      choices:
        element.properties.choices?.map((choice) => ({
          ...choice,
          id: uuidv4(),
        })) ?? [],
    },
  }));
}

export function generateDuplicateSurvey(
  survey: SurveyWithParsedModelType,
  input: Omit<CreateSurveyInputType, 'duplicatedFrom'>,
): Omit<SurveyWithParsedModelType, 'createdAt' | 'updatedAt' | 'id'> {
  const {model} = survey;
  let newTitle = input.title;
  let newDescription = input.description;

  if (!newTitle) {
    newTitle = survey.model.title
      ? `${survey.model.title} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  if (!newDescription) {
    newDescription = model.description
      ? `${model.description} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  return {
    is_published: false,
    userId: survey.userId,
    model: {
      ...survey.model,
      title: newTitle,
      description: newDescription,
      fields: duplicateElements(survey.model.fields),
    },
  };
}

export function generateNewSurvey(
  input: Omit<CreateSurveyInputType, 'duplicatedFrom'> & {userId: string},
): Omit<SurveyWithParsedModelType, 'createdAt' | 'updatedAt' | 'id'> {
  let newTitle = input.title;
  let newDescription = input.description;

  if (!newTitle) {
    newTitle = 'Untitled Survey';
  }

  if (!newDescription) {
    newDescription = 'Untitled Survey';
  }

  return {
    userId: input.userId,
    is_published: false,
    model: {
      title: newTitle,
      description: newDescription,
      fields: [],
      screens: {
        welcome: [],
        thank_you: [],
      },
      version: 1,
    },
  };
}

export function transformResponsesMap(
  responsesMap: SurveyResponsesMap,
): ResponseType[] {
  return Object.entries(responsesMap).map(([questionId, response]) => {
    return {
      questionId,
      value: response.value,
      type: response.type,
    };
  });
}
