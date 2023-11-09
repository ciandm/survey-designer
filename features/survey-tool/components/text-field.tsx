import React from 'react';
import {Controller} from 'react-hook-form';
import {QuestionType} from '@prisma/client';
import {QuestionConfig} from '@/lib/validations/question';
import {QuestionFormControl} from './question-form';

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  type: Extract<QuestionType, 'SHORT_TEXT' | 'LONG_TEXT'>;
  question: QuestionConfig;
  view?: 'live' | 'editing';
  control?: QuestionFormControl;
}

export const TextField = ({
  value,
  type = 'SHORT_TEXT',
  question,
  view = 'live',
  control,
  ...rest
}: Props) => {
  const Tag = type === 'SHORT_TEXT' ? 'input' : 'textarea';

  const hasCustomPlaceholder = !!question?.properties.placeholder;

  const commonProps = {
    type: 'text',
    id: 'name',
    className:
      'peer block w-full border-0 p-2 text-gray-900 outline-none focus:ring-0 sm:text-sm sm:leading-6',
    placeholder: hasCustomPlaceholder
      ? question.properties.placeholder
      : 'Your answer here...',
    rows: type === 'SHORT_TEXT' ? 1 : 3,
    readOnly: view === 'editing',
    ...(view === 'editing' && {value}),
    ...(view === 'live' && {defaultValue: value}),
    ...rest,
  };

  const renderInputWrapper = (children: React.ReactNode) => {
    return (
      <div className="relative">
        {children}
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary"
          aria-hidden="true"
        />
      </div>
    );
  };

  if (control) {
    return (
      <Controller
        control={control}
        name="response"
        render={({field, fieldState}) => (
          <>
            {renderInputWrapper(<Tag {...commonProps} {...field} />)}
            <div className="mt-4 flex justify-between">
              {fieldState.error && (
                <p
                  className="text-sm font-medium text-red-600"
                  id="email-error"
                >
                  {fieldState.error.message}
                </p>
              )}
              {question.validations.max_characters && (
                <p className="ml-auto text-sm text-gray-500">
                  {field.value.length}/
                  {question.validations.max_characters.toLocaleString()}{' '}
                  characters
                </p>
              )}
            </div>
          </>
        )}
      />
    );
  }

  return renderInputWrapper(<Tag {...commonProps} />);
};
