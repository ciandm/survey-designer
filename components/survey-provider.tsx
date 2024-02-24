'use client';

import React, {createContext, useContext} from 'react';
import {SurveySchema} from '@/lib/validations/survey';

export const SurveyContext = createContext<{
  schema: SurveySchema;
  id: string;
} | null>(null);

type Props = {
  schema: SurveySchema;
  children: React.ReactNode;
  id: string;
};

export const SurveyProvider = ({children, schema, id}: Props) => {
  return (
    <SurveyContext.Provider value={{schema, id}}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveyProvider = () => {
  const ctx = useContext(SurveyContext);

  if (!ctx) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }

  return ctx;
};
