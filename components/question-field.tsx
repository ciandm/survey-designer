import React from 'react';
import {Label} from '@/components/ui/label';
import {FieldSchema} from '@/types/field';
import {cn} from '@/utils/classnames';
import {FormDescription, FormItem, FormLabel} from './ui/form';

type QuestionFieldProps = {
  index: number;
  field: FieldSchema;
  children: React.ReactNode;
  isReadonly?: boolean;
  id?: string;
};

export const QuestionField = ({
  index,
  children,
  field,
  isReadonly = true,
  id,
}: QuestionFieldProps) => {
  const LabelComponent = isReadonly ? Label : FormLabel;
  const WrapperComponent = isReadonly ? React.Fragment : FormItem;
  const DescriptionComponent = isReadonly ? 'p' : FormDescription;

  return (
    <WrapperComponent>
      <div className="mb-2 flex flex-col gap-1">
        <LabelComponent
          {...(id && {htmlFor: id})}
          className={cn('break-normal text-base font-medium leading-6', {
            [`after:content-['*']`]: field.validations.required,
          })}
        >
          {index + 1}. {!!field.text ? field.text : 'Untitled question'}
        </LabelComponent>
        {!!field.description && (
          <DescriptionComponent className="text-sm text-muted-foreground">
            {field.description}
          </DescriptionComponent>
        )}
      </div>
      {children}
    </WrapperComponent>
  );
};
