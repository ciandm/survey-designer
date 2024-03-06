import {v4 as uuidv4} from 'uuid';
import type {ElementSchemaType, SurveyElementType} from '@/types/element';

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

export function getNextElementToSelect(
  elements: ElementSchemaType[],
  elementId: string,
) {
  const questionIndex = elements.findIndex(
    (element) => element.id === elementId,
  );

  const prevQuestion = elements[questionIndex - 1];
  const nextQuestion = elements[questionIndex + 1];

  return (prevQuestion || nextQuestion).ref;
}

export function validateIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}
