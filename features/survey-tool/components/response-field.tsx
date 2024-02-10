'use client';

import {Separator} from '@/components/ui/separator';
import {MultipleChoiceField} from './multiple-choice-field';
import {useQuestionContext} from './question-provider';

export const ResponseField = () => {
  const {question} = useQuestionContext();

  switch (question.type) {
    case 'short_text':
    case 'long_text':
      return null;
    case 'multiple_choice':
      return (
        <>
          <Separator className="my-4" />
          <MultipleChoiceField />
        </>
      );
  }
};
