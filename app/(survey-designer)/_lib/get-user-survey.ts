import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {surveySchema} from '@/lib/validations/survey';

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

  const parsedSchema = surveySchema.safeParse(survey.schema);

  if (!parsedSchema.success) {
    return null;
  }

  return {
    ...survey,
    schema: parsedSchema.data,
  };
};
