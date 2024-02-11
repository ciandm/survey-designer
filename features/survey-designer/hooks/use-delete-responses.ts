import {useMutation} from '@tanstack/react-query';
import {deleteSurveyResponses} from '@/lib/api/survey';

export const useDeleteResponses = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => deleteSurveyResponses(surveyId),
  });
};
