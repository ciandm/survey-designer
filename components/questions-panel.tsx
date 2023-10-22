'use client';

import {Fragment} from 'react';
import {Separator} from '@radix-ui/react-select';
import {useQuestions} from '@/stores/question/questions';
import {Button} from './ui/button';
import QuestionDesigner from './question-designer';

export const QuestionsPanel = () => {
  const questions = useQuestions();

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
