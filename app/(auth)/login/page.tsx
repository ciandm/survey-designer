import {redirect} from 'next/navigation';
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
    </div>
  );
}
