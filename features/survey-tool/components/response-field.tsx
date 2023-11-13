'use client';

import {useQuestionContext} from './question-provider';
import {TextField} from './text-field';

export const ResponseField = () => {
  const {question, view} = useQuestionContext();

  switch (question.type) {
    case 'short_text':
    case 'long_text':
      return <TextField question={question} type={question.type} view={view} />;
  }
};
