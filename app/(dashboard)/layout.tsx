import React from 'react';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {UserAccountNav} from '@/features/auth/components/user-account-nav';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/utils/hrefs';

const DashboardLayout = async ({children}: {children: React.ReactNode}) => {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center border-b">
        <div className="container flex w-full items-center justify-between">
          <div className="flex items-center space-x-4 p-2">
            <Link
              href={getSiteUrl.dashboardPage()}
              className="text-base font-semibold tracking-tight"
            >
              Dashboard
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4 py-2">
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
