'use client';

import {MultipleChoiceField} from './multiple-choice-field';
import {useQuestionContext} from './question-provider';
import {TextField} from './text-field';

export const ResponseField = () => {
  const {question} = useQuestionContext();

  switch (question.type) {
    case 'short_text':
    case 'long_text':
      return <TextField />;
    case 'multiple_choice':
      return <MultipleChoiceField />;
  }
};
