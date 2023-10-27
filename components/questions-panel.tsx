'use client';

import {Fragment} from 'react';
import {Separator} from '@radix-ui/react-select';
import {useQuestions, useSelectedQuestionId} from '@/stores/question/questions';
import {QuestionDesigner} from './question-designer/question-designer';

export const QuestionsPanel = () => {
  const questions = useQuestions();
  const selectedQuestionId = useSelectedQuestionId();

  const selectedQuestion = questions.find(
    (question) => question.id === selectedQuestionId,
  );

  return (
    <QuestionDesigner
      questionNumber={1}
      question={question}
      isActive={index === 0}
    />
  );
};
