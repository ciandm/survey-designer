import {useQueryState, UseQueryStateReturn} from 'next-usequerystate';
import {QuestionConfig} from '@/lib/validations/question';
import {useQuestions} from '../store/questions';

const QUERY_STATE_KEY = 'question';

export const useActiveQuestion = (): {
  activeQuestion: QuestionConfig | undefined;
  activeQuestionIndex: number;
  setActiveQuestion: UseQueryStateReturn<string, string>['1'];
} => {
  const [activeQuestionParam, setActiveQuestion] = useQueryState(
    QUERY_STATE_KEY,
    {
      defaultValue: '',
    },
  );
  const questions = useQuestions();

  const activeQuestionIndex = questions.findIndex(
    (question) => question.ref === activeQuestionParam,
  );

  const activeQuestion = questions[activeQuestionIndex];

  return {
    activeQuestion,
    activeQuestionIndex,
    setActiveQuestion,
  };
};
