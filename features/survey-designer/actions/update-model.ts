'use server';

import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {updateModelInput} from '@/lib/validations/survey';

export const updateModelAction = action(
  updateModelInput,
  async ({id, model}) => {
    const {user} = await getUser();

    if (!user) {
      throw new ActionError('Unauthorized');
    }

    const survey = await db.survey.update({
      where: {
        id,
      },
      data: {
        model: {
          ...model,
          version: (model?.version ?? 0) + 1,
        },
      },
    });

    return {
      survey,
      success: true,
    };
  },
);
