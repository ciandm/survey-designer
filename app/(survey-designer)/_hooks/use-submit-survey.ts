import {useMutation} from '@tanstack/react-query';
import {surveyApi} from '@/lib/api/survey';
import {ResponseType} from '@/types/survey';

export const useSubmitSurvey = () => {
  return useMutation<
    null,
    Error,
    {surveyId: string; responses: ResponseType[]}
  >({
    mutationFn: async ({responses, surveyId}) =>
      surveyApi.createSurveyResponse(surveyId, responses),
  });
};
