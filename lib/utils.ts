import {QuestionType} from '@prisma/client';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuestionType(type: QuestionType) {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return 'Text';
    case QuestionType.LONG_TEXT:
      return 'Long Text';
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.SINGLE_CHOICE:
      return 'Single Choice';
  }
}
