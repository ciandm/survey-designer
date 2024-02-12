import {useMutation} from '@tanstack/react-query';
import {createSurveyResponse} from '@/lib/api/survey';
import {ResponseSchema, SurveyResponse} from '@/lib/validations/survey';

export const useSubmitSurvey = () => {
  return useMutation<
    null,
    Error,
    {surveyId: string; responses: ResponseSchema[]}
  >({
    mutationFn: async ({responses, surveyId}) =>
      createSurveyResponse(surveyId, responses),
  });
};
