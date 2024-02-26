import {useMutation} from '@tanstack/react-query';
import {api, DuplicateSurveyParams} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';

export const useDuplicateSurvey = () => {
  return useMutation<SurveyResponse, Error, DuplicateSurveyParams>({
    mutationFn: async (params) => api.duplicateSurvey(params),
  });
};
