import {useState} from 'react';
import {ID_PREFIXES, QuestionType} from '@/lib/constants/question';
import {ChoicesConfig, QuestionConfig} from '@/lib/validations/question';
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
  const [step, setStep] = useState<Step>(() => {
    if (schema.welcome_screen) return 'welcome';
    if (schema.questions.length) return 'questions';
    return 'thank_you';
  });
  const [questions] = useState<QuestionConfig[]>(() => {
    return schema.questions.map((question) => ({
      ...question,
      properties: {
        ...question.properties,
        choices: question.properties.randomise
          ? randomiseChoices(question.properties.choices)
          : question.properties.choices,
      },
    }));
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

  const handleAddResponse = ({questionId, value, type}: QuestionResponse) => {
    if (responses.find((r) => r.questionId === questionId)) {
      return setResponses(
        responses.map((r) =>
          r.questionId === questionId ? {...r, value, type} : r,
        ),
      );
    }

    setResponses([...responses, {questionId, value, type}]);
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
    handleAddResponse({
      questionId: currentQuestionId,
      value: data.response,
      type: data.type,
    });

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

function randomiseChoices(choices: ChoicesConfig = []) {
  const copiedChoices = [...choices];

  return copiedChoices.sort((choice) => {
    if (choice.id.startsWith(ID_PREFIXES.OTHER_CHOICE)) return 1;

    return Math.random() - 0.5;
  });
}
