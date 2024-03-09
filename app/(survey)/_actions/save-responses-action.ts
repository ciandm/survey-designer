'use server';

import {cookies} from 'next/headers';
import {db} from '@/lib/db';
import {action} from '@/lib/safe-action';
import {saveResponsesInput} from '@/lib/validations/survey';
import {COMPLETED_SURVEY_COOKIE} from '../_constants/survey';

export const saveResponsesAction = action(
  saveResponsesInput,
  async ({surveyId, responses}) => {
    await db.surveyResult.create({
      data: {
        surveyId: surveyId,
        responses,
      },
    });

    /**
     * Set a cookie to indicate that the survey has been completed, so
     * that we can redirect the user to the protected thank you page.
     */
    cookies().set(COMPLETED_SURVEY_COOKIE, surveyId, {
      path: `/survey/${surveyId}/complete`,
    });

    return {
      success: true,
    };
  },
);
