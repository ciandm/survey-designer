'use server';

import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {deleteSurveyInput} from '@/lib/validations/survey';

export const deleteSurveyAction = action(
  deleteSurveyInput,
  async ({surveyId}) => {
    const {user} = await getUser();

    if (!user) {
      throw new ActionError('Unauthorized');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({success: true});
      }, 1000);
    });

    // await db.survey.delete({
    //   where: {
    //     id: surveyId,
    //     userId: user.id,
    //   },
    // });

    // return {
    //   success: true,
    // };
  },
);
