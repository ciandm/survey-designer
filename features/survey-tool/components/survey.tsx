import {FormProvider, useFormContext} from 'react-hook-form';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {QuestionConfig} from '@/lib/validations/question';
import {SurveySchema} from '@/lib/validations/survey';
import {QuestionFormState, useQuestionForm} from '../hooks/use-question-form';
import {QuestionResponse, useSurvey} from '../hooks/use-survey';
import {getQuestionStates} from '../utils/question';
import {QuestionChoices} from './question-choices';
import {QuestionWording} from './question-wording';

export const Survey = ({schema}: {schema: SurveySchema}) => {
  const {questions = []} = schema;
  const {handlers, currentQuestionId, responses, step, question, form} =
    useSurvey({
      schema,
    });

  const {handleSetPreviousQuestion} = handlers;

  const {questionIndex, canGoBack} = getQuestionStates(
    questions,
    currentQuestionId,
  );

  return (
    <>
      {step === 'welcome' && <h1>Welcome!</h1>}
      {step === 'questions' && (
        <Form
          currentQuestionId={currentQuestionId}
          onSubmit={form.onSubmit}
          question={question}
          responses={responses}
          key={currentQuestionId}
        >
          <QuestionWording
            question={question}
            view="live"
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
          />
          <QuestionChoices view="live" question={question} />
          <div className="mt-8 flex">
            {canGoBack && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSetPreviousQuestion}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button className="ml-auto" type="submit">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Form>
      )}
      {step === 'thank_you' && <h1>Thank you!</h1>}
    </>
  );
};

type FormProps = {
  question: QuestionConfig;
  children: React.ReactNode;
  responses: QuestionResponse[];
  currentQuestionId: string;
  onSubmit: (data: QuestionFormState) => void;
};

const Form = ({
  children,
  question,
  responses,
  currentQuestionId,
  onSubmit: onSubmitProp,
}: FormProps) => {
  const methods = useQuestionForm({
    question,
    responses,
    currentQuestionId,
  });

  const {handleSubmit} = methods;

  const onSubmit = handleSubmit((data) => {
    onSubmitProp(data);
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex h-full w-full flex-col items-center justify-center bg-card p-12"
      >
        <div className="w-full max-w-2xl">{children}</div>
      </form>
    </FormProvider>
  );
};

export const QuestionFormConnect = ({
  children,
}: {
  children: (methods: ReturnType<typeof useQuestionForm>) => React.ReactNode;
}) => {
  const methods = useFormContext<QuestionFormState>();

  return <>{children({...methods})}</>;
};
