import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';

export const useDeleteResponses = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => api.deleteSurveyResults(surveyId),
  });
};
