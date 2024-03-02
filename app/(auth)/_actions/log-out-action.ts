'use server';

import {cookies} from 'next/headers';
import {getUser, lucia} from '@/lib/auth';
import {action, ActionError} from '@/lib/safe-action';

export const logOutAction = action({}, async () => {
  const {user, session} = await getUser();

  if (!user) {
    throw new ActionError('You are not logged in');
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    success: true,
  };
});
