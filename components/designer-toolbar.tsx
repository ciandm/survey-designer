import React from 'react';
import {User} from 'lucia';
import Link from 'next/link';
import {UserAccountNav} from '@/dashboard/_components/user-account-nav';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {SurveyActions} from '@/survey-designer/_components/survey-actions';
import {TabConfig} from '@/types/tab';

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
    <header className="md:14 start sticky top-0 z-10 flex h-14 flex-shrink-0 flex-row justify-between border-b bg-card p-4 md:items-center md:py-0">
      <div className="flex space-x-2 text-sm font-medium text-muted-foreground">
        <Link href={homeHref} className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{title}</span>
      </div>
      <DesignerNavigation tabs={tabs} />
      {hasActions ? (
        <div className="flex items-center space-x-4">
          <SurveyActions />
          {user && <UserAccountNav user={{username: user?.username ?? ''}} />}
        </div>
      ) : (
        <div className="hidden w-80 md:block" />
      )}
    </header>
  );
};
