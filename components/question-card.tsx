import React from 'react';
import {ContentEditable} from '@/features/survey-designer/components/content-editable';
import {setActiveElementRef} from '@/features/survey-designer/store/active-element-ref';
import {updateElement} from '@/features/survey-designer/store/survey-designer';
import {cn} from '@/lib/utils';
import {ElementSchema} from '@/lib/validations/survey';

type QuestionCardProps = {
  number: number;
  id: string;
  element: ElementSchema;
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
      element,
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
        onClick={(evt) => {
          if (isEditable) {
            evt.stopPropagation();
            onClick?.();
          }
        }}
        onDoubleClick={(evt) => {
          if (isEditable && isActive) {
            evt.stopPropagation();
            setActiveElementRef(null);
          }
        }}
        tabIndex={0}
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
          <div className="relative flex flex-col gap-1">
            <span className="absolute -left-8 w-8 self-start py-1 pr-1 text-right text-xs font-medium text-muted-foreground">
              {number}.
            </span>
            {isEditable ? (
              <ContentEditable
                tagName="h4"
                placeholder="Untitled element"
                onBlur={(e) => {
                  updateElement({
                    id,
                    text: e.target.textContent?.trim() ?? undefined,
                  });
                }}
                data-number={number}
                className={cn(
                  'self-start text-base font-medium leading-6 focus:after:content-none',
                  {
                    [`after:content-['_*']`]:
                      element.validations.required && element.text,
                  },
                )}
                value={element.text ?? ''}
              />
            ) : (
              <div className="relative">
                <span className="absolute -left-8 w-8 pr-1 pt-1 text-right text-xs font-medium text-muted-foreground">
                  {number}.
                </span>
                <label
                  className={cn('text-base font-medium leading-6', {
                    [`after:content-['_*']`]:
                      element.validations.required && element.text,
                  })}
                  htmlFor={id}
                >
                  {!!element.text ? element.text : 'Untitled element'}
                </label>
              </div>
            )}
            {isEditable ? (
              <ContentEditable
                tagName="p"
                placeholder="Description (optional)"
                onBlur={(e) => {
                  updateElement({
                    id,
                    description: e.target.textContent?.trim() ?? undefined,
                  });
                }}
                className="self-start text-sm text-muted-foreground"
                value={element.description ?? ''}
              />
            ) : (
              <>
                {!!element.description && (
                  <p className="text-sm text-muted-foreground">
                    {element.description}
                  </p>
                )}
              </>
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
