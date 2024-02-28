import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {LoginForm} from '@/features/auth/components/login-form';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';

export default async function Page() {
  const {user} = await getUser();

  if (user) {
    return redirect(getSiteUrl.homePage());
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-muted py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <LoginForm />
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href={getSiteUrl.signUpPage()}>Sign up</Link>
        </Button>
      </p>
    </div>
  );
}
