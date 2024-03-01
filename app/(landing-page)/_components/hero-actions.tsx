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
      )}
    </div>
  );
};
