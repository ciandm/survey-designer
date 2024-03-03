import React from 'react';
import {User} from 'lucia';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {TabConfig} from '@/types/tab';

const SurveyActions = dynamic(() =>
  import('@/survey-designer/_components/survey-actions').then(
    (mod) => mod.SurveyActions,
  ),
);

const UserAccountNav = dynamic(() =>
  import('@/dashboard/_components/user-account-nav').then(
    (mod) => mod.UserAccountNav,
  ),
);

type DesignerToolbarProps = {
  tabs: TabConfig[];
  homeHref: string;
  hasActions?: boolean;
  user?: User | null;
  title?: string;
};

export const DesignerToolbar = ({
  tabs,
  homeHref,
  hasActions = true,
  user = null,
  title = 'Survey editor',
}: DesignerToolbarProps) => {
  return (
    <header className="sticky top-0 z-10 flex flex-col border-b bg-blue-950 md:py-0">
      <div className="flex min-h-[3.5rem] flex-1 items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden text-sm font-medium text-white">
          <Link href={homeHref} className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="truncate font-semibold">{title}</span>
        </div>
        {hasActions ? (
          <div className="ml-auto flex items-center space-x-4">
            <SurveyActions />
            {user && <UserAccountNav user={{username: user?.username ?? ''}} />}
          </div>
        ) : (
          <div className="hidden w-80 md:block" />
        )}
      </div>
      <DesignerNavigation tabs={tabs} />
    </header>
  );
};
