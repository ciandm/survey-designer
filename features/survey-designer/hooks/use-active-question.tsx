import {useEffect, useRef} from 'react';
import {useQueryState} from 'next-usequerystate';
import {getNextQuestionToSelect} from '@/lib/utils';
import {useSurveyQuestions} from '../store/survey-designer';

const QUERY_STATE_KEY = 'ref';

export const useActiveQuestion = ({
  onActiveQuestionChange,
}: {
  onActiveQuestionChange?: (ref: string) => void;
} = {}) => {
  const onActiveQuestionChangeRef = useRef(onActiveQuestionChange);
  const questions = useSurveyQuestions();
  const [activeQuestionParam, setActiveQuestion] = useQueryState(
    QUERY_STATE_KEY,
    {
      defaultValue: questions[0]?.ref ?? null,
    },
  );

  const activeQuestionIndex = questions.findIndex(
    (question) => question.ref === activeQuestionParam,
  );

  const activeQuestion = questions[activeQuestionIndex] ?? questions[0] ?? null;

  useEffect(() => {
    onActiveQuestionChangeRef.current = onActiveQuestionChange;
  }, [onActiveQuestionChange]);

  useEffect(() => {
    if (activeQuestion && onActiveQuestionChangeRef.current) {
      onActiveQuestionChangeRef.current(activeQuestion.ref);
    }
  }, [activeQuestion]);

  return {
    activeQuestion,
    activeQuestionIndex,
    setActiveQuestion,
  };
};
