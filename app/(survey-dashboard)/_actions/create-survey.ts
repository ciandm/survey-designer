'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {getSiteUrl} from '@/lib/hrefs';
import {action, ActionError} from '@/lib/safe-action';
import {createSurveyInput, surveySchema} from '@/lib/validations/survey';
import {generateDuplicateSurvey, generateNewSurvey} from '../_utils/survey';

export const createSurveyAction = action(
  createSurveyInput,
  async ({title, description, duplicatedFrom}) => {
    const {user} = await getUser();

    if (!user) {
      throw new ActionError('Unauthorized');
    }

    if (duplicatedFrom) {
      const survey = await db.survey.findUnique({
        where: {
          id: duplicatedFrom,
          AND: {
            userId: user.id,
          },
        },
      });

      if (!survey) {
        throw new ActionError('Survey not found');
      }

      const parsedSchema = surveySchema.safeParse(survey.schema);

      if (!parsedSchema.success) {
        throw new ActionError('Survey schema is invalid');
      }

      const schema = parsedSchema.data;

      const duplicatedSurvey = await db.survey.create({
        data: generateDuplicateSurvey(
          {...survey, schema},
          {
            title,
            description,
          },
        ),
      });

      revalidatePath(getSiteUrl.homePage());

      return {
        survey: duplicatedSurvey,
        success: true,
      };
    }

    const survey = await db.survey.create({
      data: generateNewSurvey({
        title,
        description,
        userId: user.id,
      }),
    });

    revalidatePath(getSiteUrl.homePage());

    return {
      survey,
      success: true,
    };
  },
);
