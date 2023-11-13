import {Control, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {QuestionConfig} from '@/lib/validations/question';
import {QuestionResponse} from './use-survey';

export interface QuestionFormState {
  response: string[];
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
    },
    resolver: zodResolver(createSchema(question)),
  });

  return methods;
};

export type QuestionFormControl = Control<QuestionFormState>;

const schema = z.object({
  response: z.string().array(),
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

const checkIsTruthy = (response: string[]) => {
  return response.length > 0;
};
