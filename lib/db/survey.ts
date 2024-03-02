'server-only';

import {db} from '@/lib/db';
import {modelSchema} from '../validations/survey';

async function getSurveys() {
  const surveys = await db.survey.findMany();

  return surveys
    .map((survey) => {
      const model = modelSchema.safeParse(survey.model);
      if (!model.success) {
        return null;
      }

      return {
        ...survey,
        model: model.data,
      };
    })
    .filter(validateSurveyIsNotNull);
}

async function getSurveysWithResponses() {
  const surveys = await db.survey.findMany({
    include: {
      SurveyResult: true,
    },
  });

  return surveys
    .map((survey) => {
      const model = modelSchema.safeParse(survey.model);
      if (!model.success) {
        return null;
      }

      return {
        ...survey,
        model: model.data,
      };
    })
    .filter(validateSurveyIsNotNull);
}

async function getSurveyById(
  id: string,
  options: {filterPublished?: boolean} = {},
) {
  const survey = await db.survey.findUnique({
    where: {
      id,
    },
  });

  if (!survey || (options.filterPublished && !survey.is_published)) {
    return null;
  }

  const model = modelSchema.safeParse(survey.model);
  if (!model.success) {
    return null;
  }

  return {
    ...survey,
    model: model.data,
  };
}

function validateSurveyIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}
