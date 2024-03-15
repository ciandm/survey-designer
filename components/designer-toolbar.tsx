'use client';

import Link from 'next/link';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {useDesignerStoreSurvey} from '@/survey-designer/_store/designer-store';
import {TabConfig} from '@/types/tab';

type DesignerToolbarProps = {
  tabs: TabConfig[];
  homeHref: string;
  title?: string;
  children?: React.ReactNode;
};

export const DesignerToolbar = ({
  tabs,
  homeHref,
  title = 'Survey editor',
  children,
}: DesignerToolbarProps) => {
  const {title: surveyTitle} = useDesignerStoreSurvey();

  return (
    <header className="sticky top-0 z-10 flex flex-col border-b bg-blue-950 md:py-0">
      <div className="flex min-h-[3.5rem] flex-1 items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden text-sm font-medium text-white">
          <Link href={homeHref} className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="truncate font-semibold">{surveyTitle ?? title}</span>
        </div>
        {children}
      </div>
      <DesignerNavigation tabs={tabs} />
    </header>
  );
};
