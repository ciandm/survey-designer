'use client';

import {useQuestionCrud} from '@/features/survey-designer/hooks/use-question-crud';
import {cn} from '@/lib/utils';
import {useQuestionContext} from './question-provider';

export const Question = () => {
  const {question, questionNumber, totalQuestions, view} = useQuestionContext();
  const {handleDeleteQuestion, handleDuplicateQuestion} = useQuestionCrud();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <p className="mb-2 text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>
      <h1
        className={cn('text-2xl font-medium', {
          [`after:content-['*']`]:
            question.validations.required && question.text,
        })}
      >
        {question.text}
      </h1>
      {!!question.description && (
        <p className="mt-2 text-muted-foreground">{question.description}</p>
      )}
    </div>
  );
};
