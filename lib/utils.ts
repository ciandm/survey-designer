import {QuestionType} from '@prisma/client';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {v4 as uuidv4} from 'uuid';
import {QuestionConfig} from './validations/question';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuestionType(type: QuestionType) {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return 'Short Text';
    case QuestionType.LONG_TEXT:
      return 'Long Text';
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.SINGLE_CHOICE:
      return 'Single Choice';
  }
}

export function buildFieldHelper(
  type: QuestionType,
  field: Partial<QuestionConfig>,
): QuestionConfig {
  switch (type) {
    case 'LONG_TEXT':
    case 'SHORT_TEXT':
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

    case 'MULTIPLE_CHOICE':
    case 'SINGLE_CHOICE':
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
