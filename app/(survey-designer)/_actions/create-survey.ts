'use server';

import {revalidatePath} from 'next/cache';
import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {getSiteUrl} from '@/lib/hrefs';
import {action, ActionError} from '@/lib/safe-action';
import {createSurveyInput, modelSchema} from '@/lib/validations/survey';
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

      const model = modelSchema.safeParse(survey.model);

      if (!model.success) {
        throw new ActionError('Survey model is invalid');
      }

      const {data} = model;

      const duplicatedSurvey = await db.survey.create({
        data: generateDuplicateSurvey(
          {...survey, model: data},
          {
            title,
            description,
          },
        ),
      });

      revalidatePath(getSiteUrl.dashboardPage());

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

    revalidatePath(getSiteUrl.dashboardPage());

    return {
      survey,
      success: true,
    };
  },
);
