import React, {DetailedHTMLProps, HTMLAttributes} from 'react';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {ElementSchema} from '@/lib/validations/survey';
import {useDesignerActions} from '@/survey-designer/_store/survey-designer-store';

type ElementCardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const ElementCardRoot = React.forwardRef<HTMLDivElement, ElementCardProps>(
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

ElementCardRoot.displayName = 'ElementCardRoot';

type ElementCardContentProps = {
  number: number;
  children?: React.ReactNode;
  className?: string;
};

const ElementCardContent = ({
  children,
  number,
  className,
}: ElementCardContentProps) => {
  return (
    <div className={cn('s', className)}>
      <div className="relative flex flex-col">
        <span className="mb-2 text-sm uppercase tracking-wide">
          Question {number}.
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

const ElementCardTitle = ({id, element}: ElementCardTitle) => {
  const pathname = usePathname();
  const isEditable = pathname.includes('/editor');
  const {updateElement} = useDesignerActions();

  if (isEditable) {
    return (
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <label htmlFor="title" className="sr-only">
            Question title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 px-2.5 pt-1 text-lg font-medium outline-none placeholder:text-gray-400 focus:ring-0"
            placeholder="Untitled question"
          />
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            rows={2}
            name="description"
            id="description"
            className="block w-full resize-none border-0 px-2.5 py-0 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Description (optional)"
            defaultValue={''}
          />
        </div>
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

export const ElementCard = {
  Root: ElementCardRoot,
  Content: ElementCardContent,
  Title: ElementCardTitle,
};
