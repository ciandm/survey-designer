import React from 'react';
import {ContentEditable} from '@/features/survey-designer/components/content-editable';
import {updateQuestion} from '@/features/survey-designer/store/survey-designer';
import {cn} from '@/lib/utils';
import {QuestionSchema} from '@/lib/validations/survey';

type QuestionCardProps = {
  number: number;
  id: string;
  question: QuestionSchema;
  children?: React.ReactNode;
  isActive?: boolean;
  isEditable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    {
      number,
      id,
      question,
      children,
      onClick,
      isActive = false,
      isEditable = false,
      header,
      footer,
      className,
    },
    ref,
  ) => {
    return (
      <div
        onClick={onClick}
        ref={ref}
        className={cn(
          'group flex-1 overflow-hidden rounded-lg border border-slate-300 bg-card ring-ring ring-offset-2',
          {
            'ring-2': isActive,
            'cursor-pointer transition-all hover:ring-2': isEditable,
            'hover:ring-primary/50': isEditable && !isActive,
          },
          className,
        )}
      >
        {header}
        <div className="px-8 py-6">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <span className="absolute -left-8 w-8 py-1 pr-1 text-right text-xs font-medium text-muted-foreground">
                {number}.
              </span>
              {isEditable ? (
                <ContentEditable
                  tagName="h4"
                  placeholder="Untitled question"
                  onBlur={(e) => {
                    updateQuestion({
                      id,
                      text: e.target.textContent?.trim() ?? undefined,
                    });
                  }}
                  data-number={number}
                  className={cn(
                    'inline-block font-medium leading-6 focus:after:content-none',
                    {
                      [`after:content-['_*']`]:
                        question.validations.required && question.text,
                    },
                  )}
                  value={question.text ?? ''}
                />
              ) : (
                <div className="relative">
                  <span className="absolute -left-8 w-8 pr-1 pt-1 text-right text-xs font-medium text-muted-foreground">
                    {number}.
                  </span>
                  <label
                    className={cn('text-base font-medium leading-6', {
                      [`after:content-['_*']`]:
                        question.validations.required && question.text,
                    })}
                    htmlFor={id}
                  >
                    {!!question.text ? question.text : 'Untitled question'}
                  </label>
                </div>
              )}
            </div>
            {isEditable ? (
              <ContentEditable
                tagName="p"
                placeholder="Description (optional)"
                onBlur={(e) => {
                  updateQuestion({
                    id,
                    description: e.target.textContent?.trim() ?? undefined,
                  });
                }}
                className="self-start text-sm text-muted-foreground"
                value={question.description ?? ''}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {!!question.description
                  ? question.description
                  : 'Description (optional)'}
              </p>
            )}
            {children}
          </div>
        </div>
        {footer}
      </div>
    );
  },
);

QuestionCard.displayName = 'QuestionCard';
