import React from 'react';
import Link from 'next/link';
import {demoTabConfig} from '@/config/designer';
import {getSiteUrl} from '@/lib/hrefs';
import {CreatorTabManager} from '@/survey-designer/_components/creator-tab-manager';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';

const tabs = demoTabConfig.map((item) => item.tab);

const DemoLayout = ({children}: React.PropsWithChildren) => {
  return (
    <CreatorTabManager tabs={tabs}>
      <DesignerStoreInitialiser>
        <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
          <header className="sticky top-0 z-10 flex h-14 w-full items-center border-b bg-card px-4">
            <div className="flex space-x-2 text-sm font-medium text-muted-foreground">
              <Link href={getSiteUrl.homePage()} className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Survey editor (demo)</span>
            </div>
            <DesignerNavigation tabs={demoTabConfig} className="mx-auto" />
            <div className="hidden w-48 sm:block" />
          </header>
          {children}
        </div>
      </DesignerStoreInitialiser>
    </CreatorTabManager>
  );
};

export default DemoLayout;
