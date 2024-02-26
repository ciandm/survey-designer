import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';

type DuplicateSurveyParams = {
  surveyId: string;
  title: string;
  description?: string;
};

export const useDuplicateSurvey = () => {
  return useMutation<SurveyResponse, Error, DuplicateSurveyParams>({
    mutationFn: async (params) => api.duplicateSurvey(params),
  });
};
