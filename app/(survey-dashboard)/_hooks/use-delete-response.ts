import {useMutation} from '@tanstack/react-query';
import {surveyApi} from '@/lib/api/survey';

export const useDeleteSurveyResult = () => {
  return useMutation<void, Error, {surveyId: string; responseId: string}>({
    mutationFn: async ({surveyId, responseId}) =>
      surveyApi.deleteSurveyResult(surveyId, responseId),
  });
};
