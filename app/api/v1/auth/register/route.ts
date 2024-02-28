import {generateId} from 'lucia';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {Argon2id} from 'oslo/password';
import {loginSchema} from '@/features/auth/validation/login';
import {lucia} from '@/lib/auth';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const {email: username, password} = parsed.data;

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    return NextResponse.json('User already exists', {status: 400});
  }

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
  return NextResponse.json({success: true}, {status: 200});
}
