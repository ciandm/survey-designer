'server-only';

import prisma from '@/prisma/client';
import {surveySchema} from '../validations/survey';

async function getSurveys() {
  const surveys = await prisma.survey.findMany();

  return surveys
    .map((survey) => {
      const parsedSchema = surveySchema.safeParse(survey.schema);
      if (!parsedSchema.success) {
        return null;
      }

      return {
        ...survey,
        schema: parsedSchema.data,
      };
    })
    .filter(validateSurveyIsNotNull);
}

async function getSurveysWithResponses() {
  const surveys = await prisma.survey.findMany({
    include: {
      SurveyResult: true,
    },
  });

  return surveys
    .map((survey) => {
      const parsedSchema = surveySchema.safeParse(survey.schema);
      if (!parsedSchema.success) {
        return null;
      }

      return {
        ...survey,
        schema: parsedSchema.data,
      };
    })
    .filter(validateSurveyIsNotNull);
}

async function getSurveyById(id: string) {
  const survey = await prisma.survey.findUnique({
    where: {
      id,
    },
  });

  if (!survey) {
    return null;
  }

  const parsedSchema = surveySchema.safeParse(survey.schema);
  if (!parsedSchema.success) {
    return null;
  }

  return {
    ...survey,
    schema: parsedSchema.data,
  };
}

function validateSurveyIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export const db = {
  getSurveys,
  getSurveyById,
  getSurveysWithResponses,
};
