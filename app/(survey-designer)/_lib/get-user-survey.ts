import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';

export const getUserSurvey = async (id: string) => {
  const {user} = await getUser();

  if (!user) {
    return null;
  }

  const survey = await db.survey.findUnique({
    include: {
      SurveyResult: true,
    },
    where: {
      id,
      AND: {
        userId: user.id,
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
};
