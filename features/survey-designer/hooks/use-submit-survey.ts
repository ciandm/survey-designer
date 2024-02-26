import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';
import {ResponseSchema} from '@/lib/validations/survey';

export const useSubmitSurvey = () => {
  return useMutation<
    null,
    Error,
    {surveyId: string; responses: ResponseSchema[]}
  >({
    mutationFn: async ({responses, surveyId}) =>
      api.createSurveyResponse(surveyId, responses),
  });
};
