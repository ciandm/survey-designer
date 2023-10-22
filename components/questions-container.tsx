'use client';

import React from 'react';
import {Question} from '@prisma/client';
import {
  setQuestions,
  setSelectedQuestionId,
} from '@/store/features/questions-slice';
import {useAppDispatch} from '@/store/hooks';

const QuestionsContainer = ({
  children,
  questions,
}: React.PropsWithChildren<{questions: Question[]}>) => {
  const dispatch = useAppDispatch();

  dispatch(setQuestions(questions));
  dispatch(setSelectedQuestionId(questions[0]?.id ?? ''));

  return <>{children}</>;
};

export default QuestionsContainer;
