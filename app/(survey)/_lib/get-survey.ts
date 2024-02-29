import {db} from '@/lib/db';
import {surveySchema} from '@/lib/validations/survey';

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

  const parsedSchema = surveySchema.safeParse(survey.schema);

  if (!parsedSchema.success) {
    return null;
  }

  return {
    ...survey,
    schema: parsedSchema.data,
  };
}
