import {useMutation} from '@tanstack/react-query';
import {duplicateSurvey} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';

export const useDuplicateSurvey = () => {
  return useMutation<SurveyResponse, Error, {surveyId: string}>({
    mutationFn: async ({surveyId}) => duplicateSurvey(surveyId),
  });
};
