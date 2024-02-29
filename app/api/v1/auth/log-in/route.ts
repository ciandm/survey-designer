import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {Argon2id} from 'oslo/password';
import {getUser, lucia} from '@/lib/auth';
import {loginSchema} from '@/lib/validations/auth';
import {prisma} from '@/prisma/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  const {user} = await getUser();

  if (user) {
    return NextResponse.json('Already registered', {status: 400});
  }

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const {email: username, password} = parsed.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!existingUser) {
    return NextResponse.json('Incorrect username or password', {status: 400});
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );

  if (!validPassword) {
    return NextResponse.json('Incorrect username or password', {status: 400});
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return NextResponse.json({success: true}, {status: 200});
}
