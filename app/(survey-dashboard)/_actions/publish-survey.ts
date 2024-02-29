'use server';

import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {publishSurveyInput} from '@/lib/validations/survey';

export const publishSurveyAction = action(
  publishSurveyInput,
  async ({surveyId, action}) => {
    const {user} = await getUser();

    if (!user) {
      throw new ActionError('Unauthorized');
    }

    const survey = await db.survey.update({
      data: {
        is_published: action === 'publish' ? true : false,
      },
      where: {
        id: surveyId,
        AND: {
          userId: user.id,
        },
      },
    });

    return {
      survey,
      success: true,
    };
  },
);
