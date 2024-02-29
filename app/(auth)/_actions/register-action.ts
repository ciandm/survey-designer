'use server'; // don't forget to add this!

import {generateId} from 'lucia';
import {cookies} from 'next/headers';
import {Argon2id} from 'oslo/password';
import {getUser, lucia} from '@/lib/auth';
import {db} from '@/lib/db';
import {action, ActionError} from '@/lib/safe-action';
import {registerSchema} from '@/lib/validations/auth';

export const registerAction = action(
  registerSchema,
  async ({email, password}) => {
    const {user} = await getUser();

    if (user) {
      throw new ActionError('Already registered');
    }

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);

    const existingUser = await db.user.findFirst({
      where: {
        username: email,
      },
    });

    if (existingUser) {
      throw new ActionError('User already exists');
    }

    await db.user.create({
      data: {
        id: userId,
        username: email,
        hashed_password: hashedPassword,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {
      success: true,
    };
  },
);
