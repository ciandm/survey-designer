import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui';
import {AuthFormWrapper} from '@/features/auth/components/auth-form-wrapper';
import {RegisterForm} from '@/features/auth/components/register-form';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/utils/hrefs';

export default async function RegistrationPage() {
  const {user} = await getUser();
  if (user) {
    return redirect('/home');
  }

  return (
    <AuthFormWrapper>
      <AuthFormWrapper.Title>Create an account</AuthFormWrapper.Title>
      <AuthFormWrapper.Form>
        <RegisterForm />
      </AuthFormWrapper.Form>
      <AuthFormWrapper.AlternateCta>
        Have an account already?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href={getSiteUrl.loginPage()}>Log in</Link>
        </Button>
      </AuthFormWrapper.AlternateCta>
    </AuthFormWrapper>
  );
}
