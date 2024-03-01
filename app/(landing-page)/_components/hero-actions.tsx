'use clients';

import {User} from 'lucia';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {getSiteUrl} from '@/lib/hrefs';

export const HeroActions = ({user}: {user: User | null}) => {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      {user ? (
        <Button asChild>
          <Link href={getSiteUrl.dashboardPage()}>Your dashboard</Link>
        </Button>
      ) : (
        <>
          {process.env.NODE_ENV === 'development' ? (
            <>
              <Button asChild>
                <Link href={getSiteUrl.signUpPage()}>Get started</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href={getSiteUrl.loginPage()}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Log in{' '}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button asChild>
                <Link href={getSiteUrl.demoPage()}>View demo</Link>
              </Button>
              <p className="max-w-sm text-sm text-muted-foreground">
                You can view the demo without signing up and whilst the app is
                in development.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
