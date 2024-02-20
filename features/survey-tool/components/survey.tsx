'use client';

import {useState} from 'react';
import {UseControllerReturn, useFieldArray, useForm} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {z} from 'zod';
import {ElementCard, ElementCardContent} from '@/components/element-card';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {useToast} from '@/components/ui/use-toast';
import {useSubmitSurvey} from '@/features/survey-designer/hooks/use-submit-survey';
import {ELEMENT_TYPE, ElementType} from '@/lib/constants/element';
import {cn} from '@/lib/utils';
import {ElementSchema, SurveySchema} from '@/lib/validations/survey';
import {
  LongTextField,
  MultipleChoiceField,
  ShortTextField,
  SingleChoiceField,
} from './type-field';

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
    <Form {...methods}>
      <div className="flex flex-1 bg-muted py-16">
        <div className="container max-w-2xl">
          <form className="flex flex-1 flex-col gap-6" onSubmit={onSubmit}>
            {fields.map((_, index) => {
              const element = elements[index];

              return (
                <FormField
                  key={element.id}
                  control={control}
                  name={`fields.${index}.value`}
                  render={(controllerProps) => (
                    <FormItem>
                      <ElementCard key={element.id}>
                        <ElementCardContent number={index + 1}>
                          <div className="flex flex-col gap-1">
                            <FormLabel
                              className={cn(
                                'break-normal text-base font-medium leading-6',
                                {
                                  [`after:content-['_*']`]:
                                    element.validations.required &&
                                    element.text,
                                },
                              )}
                            >
                              {!!element.text
                                ? element.text
                                : 'Untitled element'}
                            </FormLabel>
                            {!!element.description && (
                              <FormDescription>
                                {element.description}
                              </FormDescription>
                            )}
                          </div>
                          <div className="mt-4">
                            {renderTypeField({element, controllerProps, index})}
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
                    </FormItem>
                  )}
                />
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
    </Form>
  );
};

type RenderTypeFieldArgs = {
  element: ElementSchema;
  index: number;
  controllerProps: UseControllerReturn<
    QuestionFormState,
    `fields.${number}.value`
  >;
};

function renderTypeField({
  element,
  controllerProps: {field},
  index,
}: RenderTypeFieldArgs) {
  switch (element.type) {
    case 'short_text':
      return <ShortTextField field={field} />;
    case 'long_text':
      return <LongTextField field={field} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceField field={field} element={element} index={index} />
      );
    case 'single_choice':
      return <SingleChoiceField element={element} field={field} />;
  }
}
