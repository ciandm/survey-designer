import {useMutation} from '@tanstack/react-query';
import axios, {AxiosResponse} from 'axios';
import {
  DeleteQuestionPayload,
  SurveyResponse,
} from '@/lib/validations/question';
import {useSurveyDetails} from '../store/survey-details';

export const useDeleteQuestion = () => {
  const {id: surveyId} = useSurveyDetails();

  return useMutation<
    AxiosResponse<SurveyResponse>,
    Error,
    DeleteQuestionPayload
  >({
    mutationFn: async ({id}) => {
      return await axios.delete(
        `/api/v1/surveys/${surveyId}/schema/questions/${id}`,
      );
    },
  });
};
