import {useMutation} from '@tanstack/react-query';
import axios, {AxiosResponse} from 'axios';
import {
  CreateQuestionPayload,
  SurveyResponse,
} from '@/lib/validations/question';
import {useSurveyDetails} from '../store/survey-details';

export const useAddQuestion = () => {
  const {id: surveyId} = useSurveyDetails();

  // TODO: Add type
  return useMutation<
    AxiosResponse<SurveyResponse>,
    Error,
    Partial<CreateQuestionPayload>
  >({
    mutationFn: async ({type = 'SHORT_TEXT'}) =>
      axios.post(`/api/v1/surveys/${surveyId}/schema/questions`, {
        type,
      }),
  });
};
