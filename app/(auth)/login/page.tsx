import {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {AuthFormWrapper} from '@/features/auth/components/auth-form-wrapper';
import {LoginForm} from '@/features/auth/components/login-form';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/utils/hrefs';

export default async function Page() {
  const {user} = await getUser();

  if (user) {
    return redirect(getSiteUrl.dashboardPage());
  }

  return (
    <AuthFormWrapper>
      <AuthFormWrapper.Title>Log in to your account</AuthFormWrapper.Title>
      <AuthFormWrapper.Form>
        <LoginForm />
      </AuthFormWrapper.Form>
      <AuthFormWrapper.AlternateCta>
        Don&apos;t have an account?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href={getSiteUrl.signUpPage()}>Sign up</Link>
        </Button>
      </AuthFormWrapper.AlternateCta>
    </AuthFormWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your account',
};
