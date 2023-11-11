import {SurveyResponse, SurveySchemaUpdate} from '../validations/survey';
import {axios} from './axios';

const ENDPOINT = '/surveys';

export async function getSurveyById(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.get(`${ENDPOINT}/${surveyId}`);

  return data;
}

export async function createSurvey(
  survey: SurveyResponse,
): Promise<SurveyResponse> {
  const {data} = await axios.post(ENDPOINT, survey);

  return data;
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}`);
}

export async function updateSurveySchema(
  schema: SurveySchemaUpdate,
): Promise<SurveyResponse> {
  const {data} = await axios.put(
    `${ENDPOINT}/${schema.survey.id}/schema`,
    schema,
  );

  return data;
}
