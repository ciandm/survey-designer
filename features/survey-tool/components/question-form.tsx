'use client';

import {Control, FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {QuestionCard} from '@/features/survey-tool/components/question-card';
import {QuestionChoices} from '@/features/survey-tool/components/question-choices';
import {QuestionWording} from '@/features/survey-tool/components/question-wording';
import {QuestionConfig} from '@/lib/validations/question';
import {useResponsesContext} from '../store/responses';
import {getPreviousQuestion, getQuestionStates} from '../utils/question';

interface State {
  response: string;
}

export type QuestionFormControl = Control<State>;

export const QuestionForm = () => {
  const currentQuestionId = useResponsesContext(
    (state) => state.currentQuestionId,
  );

  return <QuestionFormInner key={currentQuestionId} />;
};

const schema = z.object({
  response: z.string().optional(),
});

const createSchema = (question: QuestionConfig) => {
  return schema.superRefine(({response}, ctx) => {
    if (question.validations.required && !response) {
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

const QuestionFormInner = () => {
  const questions = useResponsesContext((state) => state.questions);
  const currentQuestionId = useResponsesContext(
    (state) => state.currentQuestionId,
  );
  const {addResponse, setCurrentQuestionId} = useResponsesContext(
    (state) => state.actions,
  );
  const responses = useResponsesContext((state) => state.responses);
  const {isLastQuestion, nextQuestion, questionIndex, canGoBack} =
    getQuestionStates(questions, currentQuestionId);

  const question = questions[questionIndex];

  const methods = useForm<State>({
    defaultValues: {
      response:
        responses.find((r) => r.questionId === currentQuestionId)?.response ??
        '',
    },
    resolver: zodResolver(createSchema(question)),
  });

  const {handleSubmit, control} = methods;

  const onSubmit = handleSubmit((data) => {
    addResponse(data.response);

    if (isLastQuestion) {
      return console.log('End');
    }

    setCurrentQuestionId((currentId) => {
      return nextQuestion?.id ?? currentId;
    });
  });

  if (!question) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form className="h-full w-full" onSubmit={onSubmit}>
        <QuestionCard
          view="live"
          totalQuestions={questions.length}
          questionNumber={questionIndex + 1}
          question={question}
        >
          <QuestionWording />
          <QuestionChoices control={control} />
          <div className="mt-8 flex">
            {canGoBack && (
              <Button
                type="button"
                onClick={() => {
                  setCurrentQuestionId((currentId) => {
                    const question = getPreviousQuestion(questions, currentId);
                    return question?.id ?? currentId;
                  });
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button className="ml-auto" type="submit">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </QuestionCard>
      </form>
    </FormProvider>
  );
};
