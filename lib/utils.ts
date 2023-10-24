import {QuestionType} from '@prisma/client';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuestionType(type: QuestionType) {
  switch (type) {
    case QuestionType.TEXT:
      return 'Text';
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.SINGLE_CHOICE:
      return 'Single Choice';
  }
}
