'use client';

import {useQuestionCardContext} from './question-card';
import {QuestionFormControl} from './question-form';
import {TextField} from './text-field';

interface Props {
  control?: QuestionFormControl;
}

export const QuestionChoices = ({control}: Props) => {
  const {question, view} = useQuestionCardContext();

  switch (question.type) {
    case 'SHORT_TEXT':
    case 'LONG_TEXT':
      return (
        <TextField
          control={control}
          question={question}
          type={question.type}
          view={view}
        />
      );
  }
};
