import {cookies} from 'next/headers';
import {NextRequest} from 'next/server';
import {Argon2id} from 'oslo/password';
import {loginSchema} from '@/features/auth/validation/login';
import {lucia} from '@/lib/auth';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error), {status: 400});
  }

  const {username, password} = parsed.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!existingUser) {
    return new Response('Incorrect username or password', {status: 400});
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );

  if (!validPassword) {
    return new Response('Incorrect username or password', {status: 400});
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return new Response(null, {status: 204});
}
