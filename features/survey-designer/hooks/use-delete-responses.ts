import {useMutation} from '@tanstack/react-query';
import {deleteSurveyResults} from '@/lib/api/survey';

export const useDeleteResponses = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => deleteSurveyResults(surveyId),
  });
};
