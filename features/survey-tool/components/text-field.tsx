import React from 'react';
import {Controller} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {QuestionFormControl} from '../hooks/use-question-form';
import {useQuestionContext} from './question-provider';
import {QuestionFormConnect} from './survey';

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  control?: QuestionFormControl;
}

export const TextField = ({
  value,
  type = 'short_text',
  control,
  ...rest
}: Props) => {
  const {question, view} = useQuestionContext();
  const Tag = type === 'short_text' ? Input : Textarea;

  const hasCustomPlaceholder = !!question?.properties.placeholder;

  const commonProps = {
    type: 'text',
    placeholder: hasCustomPlaceholder
      ? question.properties.placeholder
      : 'Your answer here...',
    rows: type === 'short_text' ? 1 : 3,
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

  if (view === 'live') {
    return (
      <QuestionFormConnect>
        {({control}) => (
          <Controller
            control={control}
            name="response"
            render={({field: {onChange, ...restField}, fieldState}) => (
              <>
                <Tag
                  {...commonProps}
                  {...restField}
                  onChange={(e) => onChange([e.target.value])}
                />
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
                      {restField.value[0].length}/
                      {question.validations.max_characters.toLocaleString()}{' '}
                      characters
                    </p>
                  )}
                </div>
              </>
            )}
          />
        )}
      </QuestionFormConnect>
    );
  }

  return renderInputWrapper(<Tag {...commonProps} />);
};
