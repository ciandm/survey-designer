import {useMutation} from '@tanstack/react-query';
import {deleteSurvey} from '@/lib/api/survey';

export const useDeleteSurvey = () => {
  return useMutation<void, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => deleteSurvey(surveyId),
  });
};
