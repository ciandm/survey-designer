'use client';

import React, {createContext, useContext} from 'react';
import {SurveyWithParsedModelType} from '@/types/survey';

export const SurveyContext = createContext<{
  survey: SurveyWithParsedModelType;
} | null>(null);

type Props = {
  survey: SurveyWithParsedModelType;
  children: React.ReactNode;
};

export const SurveyProvider = ({children, survey}: Props) => {
  return (
    <SurveyContext.Provider value={{survey}}>{children}</SurveyContext.Provider>
  );
};

export const useSurveyProvider = () => {
  const ctx = useContext(SurveyContext);

  if (!ctx) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }

  return ctx;
};
