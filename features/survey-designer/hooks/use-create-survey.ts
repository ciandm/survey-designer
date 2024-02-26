import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';
import {CreateSurveyInput, SurveyResponse} from '@/lib/validations/survey';

export const useCreateSurvey = () => {
  return useMutation<SurveyResponse, Error, CreateSurveyInput>({
    mutationFn: async ({title, description}) =>
      api.createSurvey({
        title,
        description,
      }),
  });
};
