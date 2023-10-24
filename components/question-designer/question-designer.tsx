'use client';

import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import {Controller, useForm} from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import {Prisma, QuestionType} from '@prisma/client';
import {cn} from '@/lib/utils';
import {
  setSelectedQuestionId,
  useSelectedQuestionId,
} from '@/stores/question/questions';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';
import {Input} from '../ui/input';
import {QuestionOptions} from './components/question-options';

interface Props {
  question: Prisma.QuestionGetPayload<{include: {answers: true}}>;
  questionNumber: number;
  isActive?: boolean;
}

interface FormState {
  title: string;
  description: string;
  type: QuestionType;
}

export const QuestionDesigner = ({question, questionNumber}: Props) => {
  const [showDescription, setShowDescription] = useState(
    !!question.description,
  );
  const {control, watch} = useForm<FormState>({
    defaultValues: {
      title: question.text,
      type: question.type,
    },
  });
  const selectedQuestionId = useSelectedQuestionId();
  const onQuestionClick = () => {
    setSelectedQuestionId(question.id);
  };

  const {type} = watch();

  const isActive = selectedQuestionId === question.id;

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <form
        key={question.id}
        className={cn(
          'flex cursor-pointer flex-col border border-transparent p-8',
          {
            'bg-primary-foreground': selectedQuestionId === question.id,
          },
        )}
        onClick={onQuestionClick}
      >
        <p className="mb-1 text-sm text-muted-foreground">
          Question {questionNumber}
        </p>
        <Controller
          name="title"
          control={control}
          render={({field}) => (
            <TextareaAutosize
              className="mt-4 block w-full resize-none border-0 bg-transparent p-0 text-2xl font-medium text-gray-900 outline-none placeholder:text-gray-600 focus:ring-0 sm:text-2xl sm:leading-6"
              placeholder="Add a question"
              cacheMeasurements
              {...field}
            />
          )}
        />

        {showDescription && (
          <Controller
            name="description"
            control={control}
            render={({field}) => (
              <TextareaAutosize
                className="mt-4 block w-full resize-none border-0 bg-transparent p-0 text-base text-gray-600 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                placeholder="Add a description"
                cacheMeasurements
                {...field}
              />
            )}
          />
        )}
        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              {type === QuestionType.TEXT && (
                <Input type="text" readOnly placeholder="User enter text" />
              )}
            </CardContent>
          </Card>
        </div>
        {mounted &&
          isActive &&
          createPortal(
            <QuestionOptions
              control={control}
              hasDescription={showDescription}
              setHasDescription={setShowDescription}
            />,
            document.getElementById('options-playground')!,
          )}
        <Button variant="ghost" className="ml-auto mt-8">
          Save changes
        </Button>
      </form>
    </>
  );
};
