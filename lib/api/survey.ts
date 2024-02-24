import {
  CreateSurveySchema,
  ResponseSchema,
  SurveyResponse,
  UpdateSurveySchema,
} from '../validations/survey';
import {axios} from './axios';

const ENDPOINT = '/surveys';

export async function getSurveyById(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.get(`${ENDPOINT}/${surveyId}`);

  return data;
}

export async function createSurvey(
  params: CreateSurveySchema,
): Promise<SurveyResponse> {
  const {data} = await axios.post(ENDPOINT, params);

  return data;
}

export async function duplicateSurvey(
  surveyId: string,
): Promise<SurveyResponse> {
  const {data} = await axios.post(
    `${ENDPOINT}?survey_to_duplicate=${surveyId}`,
  );

  return data;
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}`);
}

export async function publishSurvey(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.patch(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

export async function unpublishSurvey(
  surveyId: string,
): Promise<SurveyResponse> {
  const {data} = await axios.delete(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

export async function updateSurveyInput(
  surveyId: string,
  schema: UpdateSurveySchema,
): Promise<SurveyResponse> {
  const {data} = await axios.put(`${ENDPOINT}/${surveyId}/schema`, schema);

  return data;
}

export async function createSurveyResponse(
  surveyId: string,
  responses: ResponseSchema[],
): Promise<null> {
  const {data} = await axios.post(`${ENDPOINT}/${surveyId}/results`, {
    responses,
  });

  return data;
}

export async function deleteSurveyResults(surveyId: string): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}/results`);
}

export async function deleteSurveyResult(
  surveyId: string,
  responseId: string,
): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}/results/${responseId}`);
}
