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
