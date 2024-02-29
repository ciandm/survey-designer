import React, {DetailedHTMLProps, HTMLAttributes} from 'react';
import {usePathname} from 'next/navigation';
import {ContentEditable} from '@/app/(survey-builder)/_components/content-editable';
import {useDesignerActions} from '@/app/(survey-builder)/_store/survey-designer-store';
import {cn} from '@/lib/utils';
import {ElementSchema} from '@/lib/validations/survey';

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
    <div className={cn('px-8 py-6', className)}>
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

const ElementCardTitle = ({id, element}: ElementCardTitle) => {
  const pathname = usePathname();
  const isEditable = pathname.includes('/editor');
  const {updateElement} = useDesignerActions();

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

export const ElementCard = {
  Root: ElementCardRoot,
  Content: ElementCardContent,
  Title: ElementCardTitle,
};
