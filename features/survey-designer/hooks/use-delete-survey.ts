import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';

export const useDeleteSurvey = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => api.deleteSurvey(surveyId),
  });
};
