'use client';

import React, {createContext, useContext} from 'react';
import {QuestionSchema} from '@/lib/validations/survey';

type QuestionView = 'live' | 'editing';

interface QuestionCardProps {
  question: QuestionSchema;
  totalQuestions: number;
  questionNumber: number;
  view?: QuestionView;
}

export const QuestionProvider = ({
  children,
  question,
  totalQuestions,
  questionNumber,
  view = 'editing',
}: React.PropsWithChildren<QuestionCardProps>) => {
  return (
    <QuestionContext.Provider
      value={{question, totalQuestions, questionNumber, view}}
    >
      {children}
    </QuestionContext.Provider>
  );
};

const QuestionContext = createContext<QuestionCardProps | null>(null);

export const useQuestionContext = () => {
  const ctx = useContext(QuestionContext);

  if (!ctx) throw new Error('Question not available');

  return ctx;
};
