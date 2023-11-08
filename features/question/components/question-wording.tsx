'use client';

import {cn} from '@/lib/utils';
import {ContentEditable} from '../../survey-designer/components/content-editable';
import {useQuestionCardContext} from './question-card';

type Props = {
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
};

export const QuestionWording = ({
  onDescriptionChange,
  onTitleChange,
}: Props) => {
  const {question, questionNumber, totalQuestions, view} =
    useQuestionCardContext();
  const {text, id, validations, description} = question;

  let content = null;

  const titleClassName = cn('text-2xl font-bold', {
    [`after:content-['*']`]: validations.required && text,
  });

  if (view === 'editing') {
    content = (
      <>
        <ContentEditable
          className={titleClassName}
          placeholder="Begin typing your question here..."
          html={text ?? ''}
          onChange={(e) => onTitleChange?.(e.target.value)}
        />
        <ContentEditable
          className="mt-2"
          placeholder="Description (optional)"
          html={description ?? ''}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
        />
      </>
    );
  } else {
    content = (
      <>
        <h1 className={titleClassName}>{text}</h1>
        {!!description && <p className="mt-2">{description}</p>}
      </>
    );
  }

  return (
    <div className="mb-4 flex flex-col">
      <p className="mb-2 text-sm text-muted-foreground">
        Question {questionNumber} of {totalQuestions}
      </p>
      {content}
    </div>
  );
};
