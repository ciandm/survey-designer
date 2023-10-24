'use client';

import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  Control,
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import {zodResolver} from '@hookform/resolvers/zod';
import {Prisma, QuestionType} from '@prisma/client';
import {z} from 'zod';
import {cn} from '@/lib/utils';
import {questionDesignSchema} from '@/lib/validations/question';
import {
  setSelectedQuestionId,
  useSelectedQuestionId,
} from '@/stores/question/questions';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {Separator} from '../ui/separator';
import {Textarea} from '../ui/textarea';
import {QuestionOptions} from './components/question-options';

interface Props {
  question: Prisma.QuestionGetPayload<{include: {answers: true}}>;
  questionNumber: number;
  isActive?: boolean;
}

export type QuestionDesignerFormData = z.infer<typeof questionDesignSchema>;

export type QuestionDesignerControl = Control<QuestionDesignerFormData>;

export const QuestionDesigner = ({question, questionNumber}: Props) => {
  const [showDescription, setShowDescription] = useState(
    !!question.description,
  );
  const methods = useForm<QuestionDesignerFormData>({
    defaultValues: {
      title: question.text,
      type: question.type,
      description: question.description ?? '',
      choices: [],
      config: {},
    },
    resolver: zodResolver(questionDesignSchema),
  });
  const {watch, control} = methods;
  const selectedQuestionId = useSelectedQuestionId();
  const onQuestionClick = () => {
    setSelectedQuestionId(question.id);
  };
  const {type, config} = watch();
  const isActive = selectedQuestionId === question.id;
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  const questionTypeMap = {
    [QuestionType.SHORT_TEXT]: <TextQuestion type="SHORT_TEXT" />,
    [QuestionType.LONG_TEXT]: <TextQuestion type="LONG_TEXT" />,
    [QuestionType.MULTIPLE_CHOICE]: <p>Multiple choice</p>,
    [QuestionType.SINGLE_CHOICE]: <p>Single choice</p>,
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          (data) => console.log(data),
          (e) => console.log(e),
        )}
        key={question.id}
        className={cn(
          'flex cursor-pointer flex-col border border-transparent p-8',
          {
            'bg-primary-foreground': selectedQuestionId === question.id,
          },
        )}
        onClick={onQuestionClick}
      >
        <div className="flex justify-between">
          <p className="mb-1 text-sm text-muted-foreground">
            Question {questionNumber}
          </p>
          {config.required && (
            <p className="mb-1 text-sm text-muted-foreground">Required</p>
          )}
        </div>
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
            <CardContent className="p-4">{questionTypeMap[type]}</CardContent>
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
    </FormProvider>
  );
};

const TextQuestion = ({type}: {type: QuestionType}) => {
  const {control, watch} = useFormContext<QuestionDesignerFormData>();
  const {config} = watch();

  const InputComponent = type === QuestionType.SHORT_TEXT ? Input : Textarea;

  return (
    <div className="flex flex-col gap-4">
      <InputComponent type="text" readOnly placeholder={config.placeholder} />
      <Separator />
      <div className="flex flex-1 items-center gap-2 space-x-2">
        <Label htmlFor="placeholder" className="flex-shrink-0">
          Placeholder
        </Label>
        <Controller
          control={control}
          name="config.placeholder"
          render={({field}) => (
            <Input id="placeholder" className="flex-1" type="text" {...field} />
          )}
        />
      </div>
    </div>
  );
};
