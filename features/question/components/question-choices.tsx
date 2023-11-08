'use client';

import React from 'react';
import {useQuestionCardContext} from './question-card';
import {TextField} from './text-field';

export const QuestionChoices = () => {
  const {question, view} = useQuestionCardContext();

  switch (question.type) {
    case 'SHORT_TEXT':
    case 'LONG_TEXT':
      return <TextField question={question} type={question.type} view={view} />;
  }
};
