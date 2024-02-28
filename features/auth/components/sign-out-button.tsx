import React from 'react';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {getUser,lucia} from '@/lib/auth';

export const SignOutButton = () => {
  return (
    <form action={logout}>
      <Button variant="secondary">Sign out</Button>
    </form>
  );
};

async function logout(): Promise<ActionResult> {
  'use server';
  const {session} = await getUser();
  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect('/login');
}

interface ActionResult {
  error: string;
}
