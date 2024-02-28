import {generateId} from 'lucia';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {Argon2id} from 'oslo/password';
import {Input} from '@/components/ui/input';
import {getUser,lucia} from '@/lib/auth';
import prisma from '@/prisma/client';

export default async function Page() {
  const {user} = await getUser();
  if (user) {
    return redirect('/home');
  }

  return (
    <>
      <h1>Create an account</h1>
      <form action={signup}>
        <label htmlFor="username">Username</label>
        <Input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <Input type="password" name="password" id="password" />
        <br />
        <button type="submit">Continue</button>
      </form>
    </>
  );
}

async function signup(formData: FormData): Promise<ActionResult> {
  'use server';
  const username = formData.get('username');
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: 'Invalid username',
    };
  }
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: 'Invalid password',
    };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  // TODO: check if username is already used
  await prisma.user.create({
    data: {
      id: userId,
      username,
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
  return redirect('/');
}

interface ActionResult {
  error: string;
}
