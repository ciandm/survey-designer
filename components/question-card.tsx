import React from 'react';
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
          'group overflow-hidden rounded-lg border border-zinc-200 bg-card ring-ring ring-offset-2',
          {
            'ring-2': isActive,
            'cursor-pointer transition-all hover:border-primary': isEditable,
          },
          className,
        )}
      >
        {header}
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div>
              <label
                className={cn('text-base font-medium leading-6', {
                  'text-muted-foreground': !question.text,
                  [`after:content-['*']`]:
                    question.validations.required && question.text,
                })}
                htmlFor={id}
              >
                <span>{number}. </span>
                {!!question.text ? question.text : 'Untitled question'}
              </label>
              {!!question.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {question.description}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
        {footer}
      </div>
    );
  },
);

QuestionCard.displayName = 'QuestionCard';
