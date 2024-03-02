'use client';

import React, {createContext, useContext} from 'react';
import {ElementSchemaType} from '@/types/element';

type QuestionView = 'live' | 'editing';

interface QuestionCardProps {
  element: ElementSchemaType;
  totalQuestions: number;
  questionNumber: number;
  view?: QuestionView;
}

export const QuestionProvider = ({
  children,
  element,
  totalQuestions,
  questionNumber,
  view = 'editing',
}: React.PropsWithChildren<QuestionCardProps>) => {
  return (
    <QuestionContext.Provider
      value={{element, totalQuestions, questionNumber, view}}
    >
      {children}
    </QuestionContext.Provider>
  );
};

const QuestionContext = createContext<QuestionCardProps | null>(null);

export const useQuestionContext = () => {
  const ctx = useContext(QuestionContext);

  if (!ctx) throw new Error('element not available');

  return ctx;
};
