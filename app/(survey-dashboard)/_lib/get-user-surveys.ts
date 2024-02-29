import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {validateIsNotNull} from '@/lib/utils';
import {surveySchema} from '@/lib/validations/survey';

export async function getUserSurveys() {
  const {user} = await getUser();

  if (!user) {
    return [];
  }

  const surveys = await db.survey.findMany({
    where: {
      userId: user.id,
    },
    include: {
      SurveyResult: true,
    },
  });

  return surveys
    .map((survey) => {
      const parsedSchema = surveySchema.safeParse(survey.schema);
      if (!parsedSchema.success) {
        console.log(parsedSchema.error.format());
        return null;
      }

      return {
        ...survey,
        schema: parsedSchema.data,
      };
    })
    .filter(validateIsNotNull);
}
