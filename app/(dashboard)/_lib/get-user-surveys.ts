import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {validateIsNotNull} from '@/lib/utils';
import {modelSchema} from '@/lib/validations/survey';

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
      const model = modelSchema.safeParse(survey.model);
      if (!model.success) {
        console.log(model.error.format());
        return null;
      }

      return {
        ...survey,
        model: model.data,
      };
    })
    .filter(validateIsNotNull);
}
