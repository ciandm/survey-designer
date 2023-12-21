import {Control, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {QuestionConfig} from '@/lib/validations/question';
import {QuestionResponse} from './use-survey';

export interface QuestionFormState {
  response: string[];
  type: QuestionType;
}

type Props = {
  responses: QuestionResponse[];
  currentQuestionId: string;
  question: QuestionConfig;
};

export const useQuestionForm = ({
  responses,
  currentQuestionId,
  question,
}: Props) => {
  const methods = useForm<QuestionFormState>({
    defaultValues: {
      response:
        responses.find((r) => r.questionId === currentQuestionId)?.value ?? [],
      type: question.type,
    },
    resolver: zodResolver(createSchema(question)),
  });

  return methods;
};

export type QuestionFormControl = Control<QuestionFormState>;

const schema = z.object({
  response: z.string().array(),
  type: z.nativeEnum(QUESTION_TYPE),
});

const createSchema = (question: QuestionConfig) => {
  return schema.superRefine(({response}, ctx) => {
    if (
      question.validations.required &&
      (!response.length || response[0].length === 0)
    ) {
      return ctx.addIssue({
        message: 'This field is required',
        path: ['response'],
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      question.validations.max_characters &&
      response &&
      response.length > question.validations.max_characters
    ) {
      return ctx.addIssue({
        message: `Must be no more than ${question.validations.max_characters} characters`,
        path: ['response'],
        code: z.ZodIssueCode.custom,
      });
    }
  });
};
