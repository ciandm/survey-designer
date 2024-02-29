'use server';

import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {updateSchemaInput} from '@/lib/validations/survey';

export const updateSchemaAction = action(
  updateSchemaInput,
  async ({id, schema}) => {
    const {user} = await getUser();

    if (!user) {
      throw new ActionError('Unauthorized');
    }

    const survey = await db.survey.update({
      where: {
        id,
      },
      data: {
        schema: {
          ...schema,
          version: schema.version + 1,
        },
      },
    });

    return {
      survey,
      success: true,
    };
  },
);
