export const QUESTION_TYPE = {
  short_text: 'short_text',
  long_text: 'long_text',
  multiple_choice: 'multiple_choice',
  single_choice: 'single_choice',
} as const;

export type QuestionType = keyof typeof QUESTION_TYPE;