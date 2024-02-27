import {
  CreateSurveyInput,
  ResponseSchema,
  SurveyResponse,
  UpdateSurveySchema,
} from '../validations/survey';
import {axios} from './axios';

const ENDPOINT = '/surveys';

async function getSurveyById(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.get(`${ENDPOINT}/${surveyId}`);

  return data;
}

async function createSurvey(
  params: CreateSurveyInput,
): Promise<SurveyResponse> {
  const {data} = await axios.post(ENDPOINT, params);

  return data;
}

export type DuplicateSurveyParams = {
  surveyId: string;
} & CreateSurveyInput;

async function duplicateSurvey({
  surveyId,
  title,
  description,
}: DuplicateSurveyParams): Promise<SurveyResponse> {
  const {data} = await axios.post(
    `${ENDPOINT}?survey_to_duplicate=${surveyId}`,
    {
      title,
      description,
    },
  );

  return data;
}

async function deleteSurvey(surveyId: string): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}`);
}

async function publishSurvey(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.patch(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

async function unpublishSurvey(surveyId: string): Promise<SurveyResponse> {
  const {data} = await axios.delete(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

async function updateSurveyInput(
  surveyId: string,
  schema: UpdateSurveySchema,
): Promise<SurveyResponse> {
  const {data} = await axios.put(`${ENDPOINT}/${surveyId}/schema`, schema);

  return data;
}

async function createSurveyResponse(
  surveyId: string,
  responses: ResponseSchema[],
): Promise<null> {
  const {data} = await axios.post(`${ENDPOINT}/${surveyId}/results`, {
    responses,
  });

  return data;
}

async function deleteSurveyResults(surveyId: string): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}/results`);
}

async function deleteSurveyResult(
  surveyId: string,
  responseId: string,
): Promise<void> {
  await axios.delete(`${ENDPOINT}/${surveyId}/results/${responseId}`);
}

export const api = {
  createSurvey,
  createSurveyResponse,
  deleteSurvey,
  deleteSurveyResult,
  deleteSurveyResults,
  duplicateSurvey,
  getSurveyById,
  publishSurvey,
  unpublishSurvey,
  updateSurveyInput,
};
