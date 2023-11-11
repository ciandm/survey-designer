import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {v4 as uuidv4} from 'uuid';
import {QuestionType} from '../constants/question';
import {QuestionConfig} from '../validations/question';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuestionType(type: QuestionType): string {
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

export function buildNewQuestionHelper(
  type: QuestionType,
  field: Partial<QuestionConfig>,
): QuestionConfig {
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

export function getNextQuestionToSelect(
  questions: QuestionConfig[],
  questionId: string,
) {
  const questionIndex = questions.findIndex(
    (question) => question.id === questionId,
  );

  const prevQuestion = questions[questionIndex - 1];
  const nextQuestion = questions[questionIndex + 1];

  return (prevQuestion || nextQuestion).ref;
}
