'use server';

import {db} from '@/lib/db';
import {action} from '@/lib/safe-action';
import {saveResponsesInput} from '@/lib/validations/survey';

export const saveResponsesAction = action(
  saveResponsesInput,
  async ({surveyId, responses}) => {
    await db.surveyResult.create({
      data: {
        surveyId: surveyId,
        responses,
      },
    });

    return {
      success: true,
    };
  },
);
