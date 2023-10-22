'use client';

import {Fragment} from 'react';
import {Separator} from '@radix-ui/react-select';
import {useAppSelector} from '@/store/hooks';
import {Button} from './ui/button';
import QuestionDesigner from './question-designer';

export const QuestionsPanel = () => {
  const questions = useAppSelector((state) => state.questions.questions);

  return (
    <>
      {Object.values(questions).map((question, index) => (
        <Fragment key={question.id}>
          <QuestionDesigner
            questionNumber={index + 1}
            question={question}
            isActive={index === 0}
          />
          <Separator />
          <Button variant="outline" className="mx-auto" size="sm">
            Add question
          </Button>
        </Fragment>
      ))}
    </>
  );
};
