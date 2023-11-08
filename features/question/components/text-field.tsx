import React from 'react';
import {QuestionType} from '@prisma/client';
import {QuestionConfig} from '@/lib/validations/question';

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  type: Extract<QuestionType, 'SHORT_TEXT' | 'LONG_TEXT'>;
  question: QuestionConfig;
  view?: 'live' | 'editing';
}

export const TextField = ({
  value,
  type = 'SHORT_TEXT',
  question,
  view = 'live',
  ...rest
}: Props) => {
  const Tag = type === 'SHORT_TEXT' ? 'input' : 'textarea';

  const hasCustomPlaceholder = !!question?.properties.placeholder;

  return (
    <div className="flex flex-col">
      <div className="relative">
        <Tag
          type="text"
          name="name"
          id="name"
          className="peer block w-full border-0 p-2 text-gray-900 outline-none focus:ring-0 sm:text-sm sm:leading-6"
          placeholder={
            hasCustomPlaceholder
              ? question.properties.placeholder
              : 'Your answer here...'
          }
          rows={type === 'SHORT_TEXT' ? 1 : 3}
          readOnly={view === 'editing'}
          {...(view === 'editing' && {value})}
          {...(view === 'live' && {defaultValue: value})}
          {...rest}
        />
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary"
          aria-hidden="true"
        />
      </div>
      {question && question.validations.max_characters && (
        <p className="ml-auto mt-2 text-sm text-gray-500">
          {value?.toString().length ?? 0} /{' '}
          {question.validations.max_characters} characters
        </p>
      )}
    </div>
  );
};
