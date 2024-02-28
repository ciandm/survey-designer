import {useMutation} from '@tanstack/react-query';
import {surveyApi} from '@/lib/api/survey';
import {ResponseSchema} from '@/lib/validations/survey';

export const useSubmitSurvey = () => {
  return useMutation<
    null,
    Error,
    {surveyId: string; responses: ResponseSchema[]}
  >({
    mutationFn: async ({responses, surveyId}) =>
      surveyApi.createSurveyResponse(surveyId, responses),
  });
};
