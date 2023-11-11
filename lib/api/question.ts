import {SurveyResponse} from '../validations/survey';
import {axios} from './axios';

const ENDPOINT = '/surveys';

export async function deleteQuestion(
  surveyId: string,
  questionId: string,
): Promise<SurveyResponse> {
  const {data} = await axios.delete(
    `${ENDPOINT}/${surveyId}/schema/questions/${questionId}`,
  );

  return data;
}
