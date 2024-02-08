import {useState} from 'react';
import {addOrUpdateSurveyResponse} from '@/lib/api/survey';
import {QuestionType} from '@/lib/constants/question';
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
  type: QuestionType;
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

  const handleAddResponse = ({
    questionId,
    value,
    type,
  }: QuestionResponse): QuestionResponse[] => {
    let newResponses = [...responses];
    if (newResponses.find((r) => r.questionId === questionId)) {
      newResponses = responses.map((r) =>
        r.questionId === questionId ? {...r, value, type} : r,
      );
      setResponses(newResponses);
      return newResponses;
    }

    newResponses.push({questionId, value, type});
    setResponses(newResponses);
    return newResponses;
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

  const onSubmit = async (data: QuestionFormState) => {
    const responses = handleAddResponse({
      questionId: currentQuestionId,
      value: data.response,
      type: data.type,
    });

    await addOrUpdateSurveyResponse(schema.id, responses);

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
