import React, {useState} from 'react';
import {QuestionConfig} from '@/lib/validations/question';
import {getNextQuestion, getPreviousQuestion} from '../utils/question';

export type QuestionResponse = {
  questionId: string;
  value: string[];
};

export const useResponsesWorkflow = ({
  questions,
}: {
  questions: QuestionConfig[];
}) => {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(
    questions[0]?.id ?? '',
  );

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

  return {
    responses,
    currentQuestionId,
    handlers: {
      handleAddResponse,
      handleSetNextQuestion,
      handleSetPreviousQuestion,
    },
  };
};

type UseResponsesWorkflowReturn = ReturnType<typeof useResponsesWorkflow>;
export type UseResponsesWorkflowProps = Omit<
  UseResponsesWorkflowReturn,
  'handlers'
>;
export type UseResponsesWorkflowHandlers =
  UseResponsesWorkflowReturn['handlers'];
