import {useState} from 'react';
import {SurveySchema} from '@/lib/validations/survey';
import {
  getNextQuestion,
  getPreviousQuestion,
  getQuestionStates,
} from '../utils/question';
import {QuestionFormState} from './use-question-form';

export type QuestionResponse = {
  questionId: string;
  value: string[];
};

type Step = 'welcome' | 'questions' | 'thank_you';

export const useSurvey = ({schema}: {schema: SurveySchema}) => {
  const {questions} = schema;
  const [step, setStep] = useState<Step>(() => {
    if (schema.welcome_screen) return 'welcome';
    if (schema.questions.length) return 'questions';
    return 'thank_you';
  });
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(
    questions[0]?.id ?? '',
  );

  const {questionIndex, isLastQuestion} = getQuestionStates(
    questions,
    currentQuestionId,
  );
  const question = questions[questionIndex];

  const handleAddResponse = ({questionId, value}: QuestionResponse) => {
    if (responses.find((r) => r.questionId === questionId)) {
      return setResponses(
        responses.map((r) => (r.questionId === questionId ? {...r, value} : r)),
      );
    }

    setResponses([...responses, {questionId, value}]);
  };

  const handleSetNextQuestion = () => {
    const nextQuestion = getNextQuestion(questions, currentQuestionId);
    if (!nextQuestion) return;

    setCurrentQuestionId(nextQuestion.id);
  };

  const handleSetPreviousQuestion = () => {
    const previousQuestion = getPreviousQuestion(questions, currentQuestionId);
    if (!previousQuestion) return;

    setCurrentQuestionId(previousQuestion.id);
  };

  const onSubmit = (data: QuestionFormState) => {
    handleAddResponse({questionId: currentQuestionId, value: data.response});

    if (isLastQuestion) {
      setStep('thank_you');
      return;
    }

    handleSetNextQuestion();
  };

  return {
    step,
    responses,
    currentQuestionId,
    question,
    handlers: {
      handleAddResponse,
      handleSetNextQuestion,
      handleSetPreviousQuestion,
    },
    form: {
      onSubmit,
    },
  };
};
