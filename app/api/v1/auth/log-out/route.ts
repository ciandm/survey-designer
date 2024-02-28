import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {getUser, lucia} from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  const {user, session} = await getUser();

  if (!user) {
    return new Response(null, {status: 401});
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return NextResponse.json({success: true}, {status: 200});
}
