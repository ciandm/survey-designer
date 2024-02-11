import {useMutation} from '@tanstack/react-query';
import {deleteSurveyResponse} from '@/lib/api/survey';

export const useDeleteResponse = () => {
  return useMutation<void, Error, {surveyId: string; responseId: string}>({
    mutationFn: async ({surveyId, responseId}) =>
      deleteSurveyResponse(surveyId, responseId),
  });
};
