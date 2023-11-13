'use client';

import {QuestionConfig} from '@/lib/validations/question';
import {TextField} from './text-field';

interface Props {
  question: QuestionConfig;
  view: 'live' | 'editing';
}

export const QuestionChoices = ({question, view}: Props) => {
  switch (question.type) {
    case 'short_text':
    case 'long_text':
      return <TextField question={question} type={question.type} view={view} />;
  }
};
