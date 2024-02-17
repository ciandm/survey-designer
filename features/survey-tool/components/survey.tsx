'use client';

import {useState} from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {z} from 'zod';
import {QuestionCard} from '@/components/question-card';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {useSubmitSurvey} from '@/features/survey-designer/hooks/use-submit-survey';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {cn} from '@/lib/utils';
import {QuestionSchema, SurveySchema} from '@/lib/validations/survey';

export interface QuestionFormState {
  fields: {questionId: string; value: string[]; type: QuestionType}[];
  type: QuestionType;
}

const createValidationSchema = (questions: QuestionSchema[]) => {
  return z
    .object({
      fields: z.array(
        z.object({
          questionId: z.string(),
          value: z.array(z.string()),
          type: z.nativeEnum(QUESTION_TYPE),
        }),
      ),
    })
    .superRefine(({fields}, ctx) => {
      fields.forEach((field, index) => {
        const question = questions[index];

        if (
          question.validations.required &&
          (!field.value.length || field.value[0].length === 0)
        ) {
          return ctx.addIssue({
            message:
              question.properties.required_message || 'This field is required',
            path: ['fields', index, 'value'],
            code: z.ZodIssueCode.custom,
          });
        }
      });

      return ctx;
    });
};

export const Survey = ({schema}: {schema: SurveySchema}) => {
  const {questions = []} = schema;
  const [step, setStep] = useState<'welcome' | 'questions' | 'thank_you'>(
    'questions',
  );
  const {toast} = useToast();
  const {isPending: isSubmitPending, mutateAsync: handleSubmitSurvey} =
    useSubmitSurvey();

  const methods = useForm<QuestionFormState>({
    defaultValues: {
      fields: questions.map((question) => ({
        questionId: question.id,
        type: question.type,
        value: [],
      })),
    },
    resolver: zodResolver(createValidationSchema(questions)),
  });

  const {handleSubmit, control} = methods;
  const {fields} = useFieldArray({
    control,
    name: 'fields',
  });

  const onSubmit = handleSubmit(
    async (data) => {
      console.log(data);
      try {
        await handleSubmitSurvey({
          surveyId: schema.id,
          responses: data.fields.map((field) => field),
        });
        toast({
          title: 'Success',
          description: 'Your survey has been submitted',
        });
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
      <>
        <h1>Thank you!</h1>
        <p>Thank you for completing this survey.</p>
      </>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="flex flex-1 bg-muted">
        <div className="container max-w-2xl">
          <h1>Welcome!</h1>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 bg-muted py-16">
        <div className="container max-w-2xl">
          <form className="flex flex-1 flex-col gap-12" onSubmit={onSubmit}>
            {fields.map((field, index) => {
              const question = questions[index];

              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  number={index + 1}
                  id={field.questionId}
                  footer={
                    <ErrorMessage
                      name={`fields.${index}.value`}
                      render={({message}) => (
                        <footer className="bg-red-50 px-4 py-2">
                          <p className="text-sm font-medium leading-5 text-red-500">
                            {message}
                          </p>
                        </footer>
                      )}
                    />
                  }
                >
                  {question.type === 'multiple_choice' && (
                    <MultipleChoiceField
                      index={index}
                      choices={question.properties.choices}
                    />
                  )}
                  {(question.type === 'short_text' ||
                    question.type === 'long_text') && (
                    <TextQuestionField
                      type={question.type}
                      index={index}
                      id={field.questionId}
                    />
                  )}
                </QuestionCard>
              );
            })}
            <div className="ml-auto mt-8 flex justify-between">
              <Button disabled={isSubmitPending} type="submit">
                {isSubmitPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

type TextQuestionFieldProps = {
  index: number;
  id: string;
  type: QuestionType;
};

const TextQuestionField = ({index, id, type}: TextQuestionFieldProps) => {
  const Component = type === 'short_text' ? Input : Textarea;
  return (
    <QuestionFormConnect>
      {({control}) => (
        <>
          <Controller
            control={control}
            name={`fields.${index}.value`}
            render={({field: {onChange, ...restField}}) => (
              <Component
                onChange={(e) => onChange([e.target.value])}
                id={id}
                {...restField}
              />
            )}
          />
        </>
      )}
    </QuestionFormConnect>
  );
};

type MultipleChoiceFieldProps = {
  index: number;
  choices: QuestionSchema['properties']['choices'];
};

const MultipleChoiceField = ({
  index,
  choices = [],
}: MultipleChoiceFieldProps) => {
  const hasValidChoices =
    choices.length > 0 && choices.every((choice) => !!choice.value);
  return (
    <QuestionFormConnect>
      {({control}) => (
        <>
          <div className="flex flex-col gap-2">
            {hasValidChoices
              ? choices.map((choice) => (
                  <Controller
                    key={choice.id}
                    control={control}
                    name={`fields.${index}.value`}
                    render={({field}) => (
                      <label className="flex items-center gap-x-3 text-sm font-medium">
                        <Checkbox
                          {...field}
                          checked={field.value.includes(choice.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, choice.id]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (value) => value !== choice.id,
                                ),
                              );
                            }
                          }}
                        />
                        <span>{choice.value}</span>
                      </label>
                    )}
                  />
                ))
              : null}
          </div>
        </>
      )}
    </QuestionFormConnect>
  );
};

export const QuestionFormConnect = ({
  children,
}: {
  children: (methods: UseFormReturn<QuestionFormState>) => React.ReactNode;
}) => {
  const methods = useFormContext<QuestionFormState>();

  return <>{children({...methods})}</>;
};
