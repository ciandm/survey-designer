import React, {DetailedHTMLProps, HTMLAttributes} from 'react';
import {usePathname} from 'next/navigation';
import {ContentEditable} from '@/features/survey-designer/components/content-editable';
import {updateElement} from '@/features/survey-designer/store/survey-designer';
import {cn} from '@/lib/utils';
import {ElementSchema} from '@/lib/validations/survey';

type ElementCardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const ElementCard = React.forwardRef<HTMLDivElement, ElementCardProps>(
  ({children, className, ...rest}, ref) => {
    return (
      <div
        tabIndex={0}
        ref={ref}
        className={cn(
          'group flex-1 overflow-hidden rounded-lg border border-slate-300 bg-card ring-ring ring-offset-2',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ElementCard.displayName = 'ElementCard';

type ElementCardContentProps = {
  number: number;
  children?: React.ReactNode;
};

export const ElementCardContent = ({
  children,
  number,
}: ElementCardContentProps) => {
  return (
    <div className="px-8 py-6">
      <div className="relative flex flex-col">
        <span className="absolute -left-8 w-8 self-start py-1 pr-1 text-right text-xs font-medium text-muted-foreground">
          {number}.
        </span>
        {children}
      </div>
    </div>
  );
};

type ElementCardTitle = {
  id: string;
  element: ElementSchema;
};

export const ElementCardTitle = ({id, element}: ElementCardTitle) => {
  const pathname = usePathname();
  const isEditable = pathname.includes('/editor');

  if (isEditable) {
    return (
      <div className="flex flex-col gap-2">
        <ContentEditable
          tagName="h4"
          placeholder="Untitled element"
          onBlur={(e) => {
            updateElement({
              id,
              text: e.target.textContent?.trim() ?? undefined,
            });
          }}
          className={cn(
            'self-start text-base font-medium leading-6 focus:after:content-none',
            {
              [`after:content-['_*']`]:
                element.validations.required && element.text,
            },
          )}
          value={element.text ?? ''}
        />
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        className={cn('break-normal text-base font-medium leading-6', {
          [`after:content-['_*']`]:
            element.validations.required && element.text,
        })}
        htmlFor={id}
      >
        {!!element.text ? element.text : 'Untitled element'}
      </label>
      {!!element.description && (
        <p className="text-sm text-muted-foreground">{element.description}</p>
      )}
    </div>
  );
};
