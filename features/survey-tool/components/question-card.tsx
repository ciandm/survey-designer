'use client';

import React, {createContext, useContext} from 'react';
import {Card} from '@/components/ui/card';
import {QuestionConfig} from '@/lib/validations/question';

interface QuestionCardProps {
  question: QuestionConfig;
  totalQuestions: number;
  questionNumber: number;
  view: 'live' | 'editing';
}

export const QuestionCard = ({
  children,
  question,
  totalQuestions,
  questionNumber,
  view,
  ...rest
}: React.PropsWithChildren<QuestionCardProps>) => {
  return (
    <QuestionCardContext.Provider
      value={{question, totalQuestions, questionNumber, view}}
    >
      <Card
        className="flex w-full flex-1 flex-col items-center justify-center rounded-none bg-card text-foreground"
        {...rest}
      >
        <div className="flex w-full flex-col items-center justify-center py-16">
          <div className="w-full flex-1 px-32">{children}</div>
        </div>
      </Card>
    </QuestionCardContext.Provider>
  );
};

const QuestionCardContext = createContext<QuestionCardProps | null>(null);

export const useQuestionCardContext = () => {
  const ctx = useContext(QuestionCardContext);

  if (!ctx) throw new Error('QuestionCardContext not available');

  return ctx;
};
