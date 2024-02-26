import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';

export const useDuplicateSurvey = () => {
  return useMutation<SurveyResponse, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => api.duplicateSurvey(surveyId),
  });
};
