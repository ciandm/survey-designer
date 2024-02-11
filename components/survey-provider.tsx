'use client';

import React, {createContext, useContext} from 'react';
import {SurveySchema} from '@/lib/validations/survey';

export const SurveyContext = createContext<{
  survey: SurveySchema;
} | null>(null);

type Props = {
  survey: SurveySchema;
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
