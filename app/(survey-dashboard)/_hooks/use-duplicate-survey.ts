import {useMutation} from '@tanstack/react-query';
import {DuplicateSurveyParams, surveyApi} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';

export const useDuplicateSurvey = () => {
  return useMutation<SurveyResponse, Error, DuplicateSurveyParams>({
    mutationFn: async (params) => surveyApi.duplicateSurvey(params),
  });
};
