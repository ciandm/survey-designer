'use client';

import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {QuestionCard} from '@/features/question/components/question-card';
import {QuestionChoices} from '@/features/question/components/question-choices';
import {QuestionWording} from '@/features/question/components/question-wording';
import {useSurveyQuestions} from '@/stores/survey-schema';
import {useSurveyProviderContext} from './survey-provider';

interface Props extends React.PropsWithChildren<{}> {}

interface State {
  value: string[];
}

export const QuestionForm = ({children}: Props) => {
  const questions = useSurveyQuestions();
  const {currentQuestion} = useSurveyProviderContext();
  const {responses, actions} = useSurveyProviderContext();
  const methods = useForm<State>({
    defaultValues: {
      value:
        responses.find(
          (response) => response.questionId === currentQuestion.current,
        )?.response ?? [],
    },
  });

  const {handleSubmit} = methods;

  const onSubmit = handleSubmit((data) => {
    const indexOf = questions.findIndex(
      (value) => value.id === currentQuestion?.current,
    );
    actions.setCurrentQuestion((prev) => ({
      prev: prev.current,
      current: prev.next ?? '',
      next: questions[indexOf + 2]?.id ?? null,
    }));
  });

  const question = questions.find((q) => q.id === currentQuestion.current);
  const questionIndex = questions.findIndex(
    (q) => q.id === currentQuestion.current,
  );

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
          <QuestionChoices />
          <Button className="mt-8" type="submit">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </QuestionCard>
      </form>
    </FormProvider>
  );
};
