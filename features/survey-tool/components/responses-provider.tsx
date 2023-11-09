'use client';

import React, {useRef} from 'react';
import {QuestionConfig} from '@/lib/validations/question';
import {createResponsesStore, ResponsesContext} from '../store/responses';

interface Props
  extends React.PropsWithChildren<{
    questions: QuestionConfig[];
  }> {}

export const ResponsesProvider = ({children, questions}: Props) => {
  const store = useRef(
    createResponsesStore({
      currentQuestionId: questions[0].id,
      questionIds: questions.map((q) => q.id),
      questions,
    }),
  ).current;

  return (
    <ResponsesContext.Provider value={store}>
      {children}
    </ResponsesContext.Provider>
  );
};
