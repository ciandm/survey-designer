'use server'; // don't forget to add this!

import {cookies} from 'next/headers';
import {Argon2id} from 'oslo/password';
import {getUser, lucia} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {loginSchema} from '@/lib/validations/auth';

export const loginAction = action(loginSchema, async ({email, password}) => {
  const {user} = await getUser();

  if (user) {
    throw new ActionError('You are already logged in');
  }

  const existingUser = await db.user.findFirst({
    where: {
      username: email,
    },
  });

  if (!existingUser) {
    throw new ActionError('Incorrect username or password');
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );

  if (!validPassword) {
    throw new ActionError('Incorrect username or password');
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return {
    success: true,
  };
});
