import React from 'react';
import {FormDescription, FormItem, FormLabel} from '@/components/ui/form';
import {Label} from '@/components/ui/label';
import {FieldSchema} from '@/types/field';
import {cn} from '@/utils/classnames';

type FieldElementProps = {
  isReadonly?: boolean;
  children: React.ReactNode;
  id?: string;
  field: FieldSchema;
  index: number;
};

export const FieldElement = ({
  isReadonly,
  children,
  id,
  field,
  index,
}: FieldElementProps) => {
  const LabelComponent = isReadonly ? Label : FormLabel;
  const WrapperComponent = isReadonly ? React.Fragment : FormItem;
  const DescriptionComponent = isReadonly ? 'p' : FormDescription;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4">
      <div className="relative flex flex-col">
        <WrapperComponent {...(!isReadonly && {className: 'space-y-0'})}>
          <div className="flex flex-col">
            <div className="mb-2 flex flex-col gap-1">
              <LabelComponent
                {...(id && {htmlFor: id})}
                className={cn('break-normal text-base leading-6', {
                  [`after:content-['*']`]: field.validations.required,
                  'text-muted-foreground': !field.text,
                })}
              >
                <span className="font-semibold text-foreground">
                  {index + 1}.{' '}
                </span>
                <span
                  className={cn('font-normal', {
                    'text-muted-foreground': !field.text,
                  })}
                >
                  {!!field.text ? field.text : 'Untitled question'}
                </span>
              </LabelComponent>
              {!!field.description && (
                <DescriptionComponent className="text-sm text-muted-foreground">
                  {field.description}
                </DescriptionComponent>
              )}
            </div>
            {children}
          </div>
        </WrapperComponent>
      </div>
    </div>
  );
};
