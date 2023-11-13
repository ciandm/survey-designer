'use client';

import React, {createContext, useContext} from 'react';
import {QuestionConfig} from '@/lib/validations/question';

type QuestionView = 'live' | 'editing';

interface QuestionCardProps {
  question: QuestionConfig;
  totalQuestions: number;
  questionNumber: number;
  view: QuestionView;
}

export const QuestionProvider = ({
  children,
  question,
  totalQuestions,
  questionNumber,
  view,
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
