'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {Argon2id} from 'oslo/password';
import {lucia} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import prisma from '@/prisma/client';
import {loginSchema} from '../validation/login';

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onLoginAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = loginSchema.safeParse(formData);

  const fields: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    fields[key] = formData[key].toString();
  }

  if (!parsed.success) {
    return {
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const {email: username, password} = parsed.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is none-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      message: 'Incorrect username or password',
      fields,
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );
  if (!validPassword) {
    return {
      message: 'Incorrect username or password',
      fields,
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(getSiteUrl.homePage());
}
