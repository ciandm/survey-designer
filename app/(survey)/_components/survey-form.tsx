'use client';

import {useState} from 'react';
import {UseControllerReturn, useFieldArray, useForm} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircleIcon, Loader2} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {Skeleton} from '@/components/ui/skeleton';
import {ElementType} from '@/lib/constants/element';
import {cn} from '@/lib/utils';
import {createSurveyValidationSchema} from '@/survey/_utils/survey';
import {useSubmitSurvey} from '@/survey-designer/_hooks/use-submit-survey';
import {ElementSchemaType} from '@/types/element';
import {ParsedModelType} from '@/types/survey';
import {TextField} from './type-field';

export interface QuestionFormState {
  fields: {questionId: string; value: string[]; type: ElementType}[];
  type: ElementType;
}

type Step = 'welcome' | 'questions' | 'thank_you';

type SurveyProps = {
  model: ParsedModelType;
  initialStep?: Exclude<Step, 'thank_you'>;
  shouldSubmitResults?: boolean;
  surveyId: string;
};

export const SurveyForm = ({
  surveyId,
  model,
  initialStep = 'questions',
  shouldSubmitResults = true,
}: SurveyProps) => {
  const {elements = []} = model;
  const [step, setStep] = useState<Step>(initialStep);
  const {isPending: isSubmitPending, mutateAsync: handleSubmitSurvey} =
    useSubmitSurvey();

  const methods = useForm<QuestionFormState>({
    defaultValues: {
      fields: elements.map((element) => ({
        questionId: element.id,
        type: element.type,
        value: [],
      })),
    },
    resolver: zodResolver(createSurveyValidationSchema(elements)),
  });

  const {handleSubmit, control} = methods;
  const {fields} = useFieldArray({
    control,
    name: 'fields',
  });

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (shouldSubmitResults) {
          await handleSubmitSurvey({
            surveyId,
            responses: data.fields.map((field) => field),
          });
        }
        setStep('thank_you');
      } catch (error) {
        console.error(error);
      }
    },
    (errors) => {
      console.log(errors);
    },
  );

  if (step === 'thank_you') {
    return (
      <section className="flex bg-muted">
        <div className="container my-auto flex max-w-lg flex-col items-center gap-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
          <div className="space-y-3 text-center">
            <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Thank you!
            </p>
            <p className="text-lg leading-8 text-gray-600">
              {model.screens.thank_you.message ||
                'Your response has been submitted.'}
            </p>
          </div>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="flex flex-1">
        <div className="container max-w-2xl">
          <h1>Welcome!</h1>
        </div>
      </div>
    );
  }

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="w-full space-y-12">
        {fields.map((_, index) => {
          const element = elements[index];

          return (
            <FormField
              key={element.id}
              control={control}
              name={`fields.${index}.value`}
              render={(controllerProps) => (
                <FormItem>
                  <div className="flex flex-col gap-1">
                    <FormLabel
                      className={cn(
                        'break-normal text-base font-medium leading-6',
                        {
                          [`after:content-['_*']`]:
                            element.validations.required,
                        },
                      )}
                    >
                      {index + 1}.{' '}
                      {!!element.text ? element.text : 'Untitled question'}
                    </FormLabel>
                    {!!element.description && (
                      <FormDescription>{element.description}</FormDescription>
                    )}
                  </div>
                  <div className="mt-4">
                    {renderTypeField({
                      element,
                      controllerProps,
                      index,
                    })}
                  </div>
                  <ErrorMessage
                    name={`fields.${index}.value`}
                    render={({message}) => (
                      <p className="text-sm font-medium leading-5 text-red-500">
                        {message}
                      </p>
                    )}
                  />
                </FormItem>
              )}
            />
          );
        })}
        <footer>
          <Button disabled={isSubmitPending} type="submit">
            {isSubmitPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitPending ? 'Submitting...' : 'Submit'}
          </Button>
        </footer>
      </form>
    </Form>
  );
};

type RenderTypeFieldArgs = {
  element: ElementSchemaType;
  index: number;
  controllerProps: UseControllerReturn<
    QuestionFormState,
    `fields.${number}.value`
  >;
};

const MultipleChoiceField = dynamic(
  () => import('./type-field').then((mod) => mod.MultipleChoiceField),
  {
    loading: () => (
      <div className="space-y-2">
        {Array.from({length: 4}).map((_, index) => (
          <div key={index} className="flex space-x-3">
            <Skeleton className="rounded-xs h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    ),
    ssr: false,
  },
);

const SingleChoiceField = dynamic(
  () => import('./type-field').then((mod) => mod.SingleChoiceField),
  {
    loading: () => (
      <div className="space-y-2">
        {Array.from({length: 4}).map((_, index) => (
          <div key={index} className="flex space-x-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    ),
    ssr: false,
  },
);

function renderTypeField({
  element,
  controllerProps: {field},
  index,
}: RenderTypeFieldArgs) {
  switch (element.type) {
    case 'short_text':
    case 'long_text':
      return <TextField field={field} element={element} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceField field={field} element={element} index={index} />
      );
    case 'single_choice':
      return <SingleChoiceField element={element} field={field} />;
  }
}
