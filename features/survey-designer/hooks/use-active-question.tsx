import {useEffect, useRef} from 'react';
import {useQueryState} from 'next-usequerystate';
import {QuestionSchema} from '@/lib/validations/survey';
import {useSurveyQuestions} from '../store/survey-designer';

const QUERY_STATE_KEY = 'ref';

type UseActiveQuestionOptions = {
  onActiveQuestionChange?: (ref: string) => void;
};

type UseActiveQuestionResult = {
  activeQuestion: QuestionSchema | null;
  activeQuestionIndex: number;
  setActiveQuestion: (ref: string | null) => void;
};

export const useActiveQuestion = ({
  onActiveQuestionChange,
}: UseActiveQuestionOptions = {}): UseActiveQuestionResult => {
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
