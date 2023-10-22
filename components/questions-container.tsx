'use client';

import React from 'react';
import {Question} from '@prisma/client';
import {setQuestions, setSelectedQuestionId} from '@/stores/question/questions';

const QuestionsContainer = ({
  children,
  questions,
}: React.PropsWithChildren<{questions: Question[]}>) => {
  setQuestions(questions);
  setSelectedQuestionId(questions[0]?.id ?? '');

  return <>{children}</>;
};

export default QuestionsContainer;
