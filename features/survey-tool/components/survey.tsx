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
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
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
      <div className="flex flex-1 items-center bg-muted">
        <div className="container max-w-3xl py-16">
          <h1>Welcome!</h1>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 items-center bg-muted">
        <div className="container max-w-2xl py-16">
          <form className="flex flex-1 flex-col gap-12" onSubmit={onSubmit}>
            {fields.map((field, index) => {
              const question = questions[index];

              return (
                <Question
                  key={question.id}
                  question={question}
                  number={index + 1}
                  id={field.questionId}
                >
                  {question.type === 'multiple_choice' && (
                    <MultipleChoiceField
                      index={index}
                      choices={question.properties.choices}
                    />
                  )}
                  {(question.type === 'short_text' ||
                    question.type === 'long_text') && (
                    <TextQuestionField index={index} id={field.questionId} />
                  )}
                </Question>
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

type QuestionProps = {
  question: QuestionSchema;
  number: number;
  children: React.ReactNode;
  id: string;
};

const Question = ({children, question, number, id}: QuestionProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={cn('text-md font-medium', {
          'text-muted-foreground': !question.text,
          [`after:content-['*']`]:
            question.validations.required && question.text,
        })}
        htmlFor={id}
      >
        <span>{number}. </span>
        {!!question.text ? question.text : 'Untitled question'}
      </label>
      {!!question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      {children}
    </div>
  );
};

type TextQuestionFieldProps = {
  index: number;
  id: string;
};

const TextQuestionField = ({index, id}: TextQuestionFieldProps) => {
  return (
    <QuestionFormConnect>
      {({control}) => (
        <>
          <Controller
            control={control}
            name={`fields.${index}.value`}
            render={({field: {onChange, ...restField}}) => (
              <Input
                className="mt-4"
                onChange={(e) => onChange([e.target.value])}
                id={id}
                {...restField}
              />
            )}
          />
          <ErrorMessage
            name={`fields.${index}.value`}
            render={({message}) => (
              <p className="mt-1 text-sm text-red-500">{message}</p>
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
  return (
    <QuestionFormConnect>
      {({control}) => (
        <>
          <div className="flex flex-col gap-2">
            {choices.map((choice) => (
              <Controller
                key={choice.id}
                control={control}
                name={`fields.${index}.value`}
                render={({field}) => (
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <Checkbox
                      {...field}
                      checked={field.value.includes(choice.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, choice.id]);
                        } else {
                          field.onChange(
                            field.value.filter((value) => value !== choice.id),
                          );
                        }
                      }}
                    />
                    <span>{choice.value}</span>
                  </label>
                )}
              />
            ))}
          </div>
          <ErrorMessage
            name={`fields.${index}.value`}
            render={({message}) => (
              <p className="block pt-4 text-sm text-red-500">{message}</p>
            )}
          />
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
