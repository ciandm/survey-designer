import {useMutation} from '@tanstack/react-query';
import {surveyApi} from '@/lib/api/survey';

export const useDeleteSurvey = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => surveyApi.deleteSurvey(surveyId),
  });
};