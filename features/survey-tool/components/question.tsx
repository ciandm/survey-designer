'use client';

import {Copy, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useActiveQuestion} from '@/features/survey-designer/hooks/use-active-question';
import {useQuestionCrud} from '@/features/survey-designer/hooks/use-question-crud';
import {useSurveyQuestions} from '@/features/survey-designer/store/survey-designer';
import {cn} from '@/lib/utils';
import {ContentEditable} from '../../survey-designer/components/content-editable';
import {useQuestionContext} from './question-provider';

type Props = {
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
};

export const Question = ({onDescriptionChange, onTitleChange}: Props) => {
  const {question, questionNumber, totalQuestions, view} = useQuestionContext();
  const {text, validations, description} = question ?? {};
  const {handleDeleteQuestion, handleDuplicateQuestion} = useQuestionCrud();

  let content = null;

  const titleClassName = cn('text-2xl font-medium', {
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
          className="mt-2 text-muted-foreground"
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
        {!!description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </>
    );
  }

  return (
    <div className="mb-8 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="mb-2 text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </p>
        {view === 'editing' && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteQuestion(question.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateQuestion(question.id);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {content}
    </div>
  );
};
