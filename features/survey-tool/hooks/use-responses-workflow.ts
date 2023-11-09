import React from 'react';

export const useResponsesWorkflow = () => {
  const [responses, setResponses] = React.useState<string[]>([]);
  const [questionIds, setQuestionIds] = React.useState<string[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = React.useState<string>('');

  const addResponse = (response: string) => {
    setResponses([...responses, response]);
  };

  return {
    responses,
    questionIds,
    currentQuestionId,
    addResponse,
    setQuestionIds,
    setCurrentQuestionId,
  };
};
