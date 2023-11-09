'use client';

import React, {useRef} from 'react';
import {useSurveyQuestions} from '@/stores/survey-schema';
import {createResponsesStore, ResponsesContext} from '../store/responses';

export const ResponsesProvider = ({children}: React.PropsWithChildren) => {
  const questions = useSurveyQuestions();
  const store = useRef(
    createResponsesStore({
      currentQuestionId: questions[0].id,
      questionIds: questions.map((q) => q.id),
    }),
  ).current;

  return (
    <ResponsesContext.Provider value={store}>
      {children}
    </ResponsesContext.Provider>
  );
};
