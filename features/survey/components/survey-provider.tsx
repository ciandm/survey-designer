'use client';

import React, {createContext, useContext, useState} from 'react';
import {QuestionType} from '@prisma/client';
import {useSurveyQuestions} from '@/stores/survey-schema';

type CurrentQuestion = {
  prev: string | null;
  current: string;
  next: string | null;
};

export const SurveyProvider = ({children}: React.PropsWithChildren) => {
  const questions = useSurveyQuestions();
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>({
    prev: null,
    current: questions[0]?.id,
    next: questions[1]?.id || null,
  });
  const [responses, setResponses] = useState<State['responses']>([]);

  return (
    <SurveyProviderContext.Provider
      value={{
        currentQuestion,
        responses,
        actions: {setCurrentQuestion, setResponses},
      }}
    >
      {children}
    </SurveyProviderContext.Provider>
  );
};

interface State {
  currentQuestion: CurrentQuestion;
  responses: {
    questionId: string;
    response: string[];
    type: QuestionType;
  }[];
  actions: {
    setCurrentQuestion: React.Dispatch<
      React.SetStateAction<State['currentQuestion']>
    >;
    setResponses: React.Dispatch<React.SetStateAction<State['responses']>>;
  };
}

const SurveyProviderContext = createContext<State | null>(null);

export const useSurveyProviderContext = () => {
  const ctx = useContext(SurveyProviderContext);

  if (!ctx) throw new Error('SurveyProviderContext not found');

  return ctx;
};
