'use client';

import React, {Fragment} from 'react';
import {Separator} from '@radix-ui/react-select';
import {useQuestions} from '@/stores/question/questions';
import {QuestionDesigner} from './question-designer/question-designer';

export const QuestionsPanel = () => {
  const questions = useQuestions();

  return (
    <div className="relative flex">
      <div className="flex-1">
        {Object.values(questions).map((question, index) => (
          <Fragment key={question.id}>
            <QuestionDesigner
              questionNumber={index + 1}
              question={question}
              isActive={index === 0}
            />
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
