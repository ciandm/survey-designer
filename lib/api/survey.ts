import {
  CreateSurveyInputType,
  ResponseType,
  SurveyWithParsedModelType,
  UpdateSurveySchemaInputType,
} from '@/types/survey';
import {axios} from './axios';

const ENDPOINT = '/surveys';

async function getSurveyById(
  surveyId: string,
): Promise<SurveyWithParsedModelType> {
  const {data} = await axios.get(`${ENDPOINT}/${surveyId}`);

  return data;
}

async function createSurvey(
  params: CreateSurveyInputType,
): Promise<SurveyWithParsedModelType> {
  const {data} = await axios.post(ENDPOINT, params);

  return data;
}

export type DuplicateSurveyParams = {
  surveyId: string;
} & CreateSurveyInputType;

async function duplicateSurvey({
  surveyId,
  title,
  description,
}: DuplicateSurveyParams): Promise<SurveyWithParsedModelType> {
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

async function publishSurvey(
  surveyId: string,
): Promise<SurveyWithParsedModelType> {
  const {data} = await axios.patch(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

async function unpublishSurvey(
  surveyId: string,
): Promise<SurveyWithParsedModelType> {
  const {data} = await axios.delete(`${ENDPOINT}/${surveyId}/publish`);

  return data;
}

async function updateSurveyInput(
  surveyId: string,
  model: UpdateSurveySchemaInputType,
): Promise<SurveyWithParsedModelType> {
  const {data} = await axios.put(`${ENDPOINT}/${surveyId}/model`, model);

  return data;
}

async function createSurveyResponse(
  surveyId: string,
  responses: ResponseType[],
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

export const surveyApi = {
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
