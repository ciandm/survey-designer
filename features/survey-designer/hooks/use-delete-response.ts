import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';

export const useDeleteSurveyResult = () => {
  return useMutation<void, Error, {surveyId: string; responseId: string}>({
    mutationFn: async ({surveyId, responseId}) =>
      api.deleteSurveyResult(surveyId, responseId),
  });
};
