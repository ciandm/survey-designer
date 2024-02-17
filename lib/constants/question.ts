import {CheckboxIcon, FileTextIcon, InputIcon} from '@radix-ui/react-icons';

export const QUESTION_TYPE = {
  short_text: 'short_text',
  long_text: 'long_text',
  multiple_choice: 'multiple_choice',
} as const;

export type QuestionType = keyof typeof QUESTION_TYPE;

export const ID_PREFIXES = {
  QUESTION: 'question-',
  QUESTION_CHOICE: 'choice-',
  OTHER_CHOICE: 'other-',
} as const;

export const QUESTION_OPTIONS = [
  {
    label: 'Multiple Choice',
    value: QUESTION_TYPE.multiple_choice,
    icon: CheckboxIcon,
  },
  {label: 'Short text', value: QUESTION_TYPE.short_text, icon: InputIcon},
  {label: 'Long text', value: QUESTION_TYPE.long_text, icon: FileTextIcon},
];
