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
import {
  ElementCard,
  ElementCardContent,
  ElementCardTitle,
} from '@/components/element-card';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/components/ui/use-toast';
import {useSubmitSurvey} from '@/features/survey-designer/hooks/use-submit-survey';
import {ELEMENT_TYPE, ElementType} from '@/lib/constants/element';
import {ElementSchema, SurveySchema} from '@/lib/validations/survey';

export interface QuestionFormState {
  fields: {questionId: string; value: string[]; type: ElementType}[];
  type: ElementType;
}

const createValidationSchema = (elements: ElementSchema[]) => {
  return z
    .object({
      fields: z.array(
        z.object({
          questionId: z.string(),
          value: z.array(z.string()),
          type: z.nativeEnum(ELEMENT_TYPE),
        }),
      ),
    })
    .superRefine(({fields}, ctx) => {
      fields.forEach((field, index) => {
        const element = elements[index];

        if (
          element.validations.required &&
          (!field.value.length || field.value[0].length === 0)
        ) {
          return ctx.addIssue({
            message:
              element.properties.required_message || 'This field is required',
            path: ['fields', index, 'value'],
            code: z.ZodIssueCode.custom,
          });
        }
      });

      return ctx;
    });
};

export const Survey = ({schema}: {schema: SurveySchema}) => {
  const {elements = []} = schema;
  const [step, setStep] = useState<'welcome' | 'questions' | 'thank_you'>(
    'questions',
  );
  const {toast} = useToast();
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
    resolver: zodResolver(createValidationSchema(elements)),
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
          <form className="flex flex-1 flex-col gap-6" onSubmit={onSubmit}>
            {fields.map((field, index) => {
              const element = elements[index];

              return (
                <ElementCard key={element.id}>
                  <ElementCardContent number={index + 1}>
                    <ElementCardTitle id={element.id} element={element} />
                    <div className="mt-4">
                      {element.type === 'multiple_choice' && (
                        <MultipleChoiceField
                          index={index}
                          choices={element.properties.choices}
                        />
                      )}
                      {(element.type === 'short_text' ||
                        element.type === 'long_text') && (
                        <TextQuestionField
                          type={element.type}
                          index={index}
                          id={field.questionId}
                        />
                      )}
                    </div>
                  </ElementCardContent>
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
                </ElementCard>
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
  type: ElementType;
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
  choices: ElementSchema['properties']['choices'];
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
