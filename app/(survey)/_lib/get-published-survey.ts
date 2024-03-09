import {cache} from 'react';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';

export const getPublishedSurvey = cache(async (id: string) => {
  const survey = await db.survey.findUnique({
    where: {
      id,
      AND: {
        is_published: true,
      },
    },
  });

  if (!survey) {
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
});
