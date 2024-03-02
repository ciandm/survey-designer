import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';

export async function getSurvey(id: string) {
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
}
