'use server';

import {cookies} from 'next/headers';
import {z} from 'zod';
import {action} from '@/lib/safe-action';
import {COMPLETED_SURVEY_COOKIE} from '@/survey/_constants/survey';

const schema = z.object({
  surveyId: z.string(),
});

export const expireCookieAction = action(schema, async ({surveyId}) => {
  cookies().set(COMPLETED_SURVEY_COOKIE, '', {
    path: `/survey/${surveyId}/complete`,
    maxAge: 0,
  });
});
