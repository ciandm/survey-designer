import {useEffect} from 'react';
import {useQueryState, UseQueryStateReturn} from 'next-usequerystate';
import {QuestionConfig} from '@/lib/validations/question';
import {useSurveyQuestions} from '../store/survey-designer';

const QUERY_STATE_KEY = 'question';

export const useActiveQuestion = (): {
  activeQuestion: QuestionConfig | undefined;
  activeQuestionIndex: number;
  setActiveQuestion: UseQueryStateReturn<string, string>['1'];
} => {
  const questions = useSurveyQuestions();
  const [activeQuestionParam, setActiveQuestion] = useQueryState(
    QUERY_STATE_KEY,
    {
      defaultValue: questions[0]?.ref,
    },
  );

  useEffect(() => {
    const isNotValidQuestion = !questions.find(
      (question) => question.ref === activeQuestionParam,
    );

    if (isNotValidQuestion) {
      setActiveQuestion(questions[0]?.ref);
    }
  }, [questions, activeQuestionParam, setActiveQuestion]);

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
