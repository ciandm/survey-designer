import {redirect} from 'next/navigation';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {UserAccountNav} from './_components/user-account-nav';

export default async function SurveyBuilderLayout({
  children,
}: React.PropsWithChildren) {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  return (
    <>
      <header className="sticky top-0 flex items-center border-b">
        <div className="flex w-full items-center justify-between">
          <div className="ml-auto flex items-center space-x-4 p-2">
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
