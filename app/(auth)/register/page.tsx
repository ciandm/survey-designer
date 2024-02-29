import Link from 'next/link';
import {redirect} from 'next/navigation';
import {AuthFormWrapper} from '@/auth/_components/auth-form-wrapper';
import {RegisterForm} from '@/auth/_components/register-form';
import {Button} from '@/components/ui/button';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';

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
