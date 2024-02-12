import {useMutation} from '@tanstack/react-query';
import {deleteSurveyResult} from '@/lib/api/survey';

export const useDeleteSurveyResult = () => {
  return useMutation<void, Error, {surveyId: string; responseId: string}>({
    mutationFn: async ({surveyId, responseId}) =>
      deleteSurveyResult(surveyId, responseId),
  });
};
