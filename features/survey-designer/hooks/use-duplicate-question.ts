import {useMutation} from '@tanstack/react-query';
import axios, {AxiosResponse} from 'axios';
import {
  DuplicateQuestionPayload,
  SurveyResponse,
} from '@/lib/validations/question';
import {useSurveyDetails} from '../store/survey-details';

export const useDuplicateQuestion = () => {
  const {id: surveyId} = useSurveyDetails();

  // TODO: Add type
  return useMutation<
    AxiosResponse<SurveyResponse>,
    Error,
    DuplicateQuestionPayload
  >({
    mutationFn: async ({id}) =>
      axios.post(
        `/api/v1/surveys/${surveyId}/schema/questions/${id}?question_to_duplicate=${id}`,
        {
          id,
        },
      ),
  });
};
