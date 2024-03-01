import React from 'react';
import {WipAlert} from 'app/(landing-page)/_components/wip-alert';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {demoTabConfig} from '@/config/designer';
import {getSiteUrl} from '@/lib/hrefs';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {DesignerTabManager} from '@/survey-designer/_components/designer-tab-manager';

const tabs = demoTabConfig.map((item) => item.tab);

const DemoLayout = ({children}: React.PropsWithChildren) => {
  return (
    <DesignerTabManager tabs={tabs}>
      <DesignerStoreInitialiser>
        <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
          <DesignerToolbar
            tabs={demoTabConfig}
            homeHref={getSiteUrl.dashboardPage()}
            hasActions={false}
            title="Survey editor (demo)"
          />
          {children}
        </div>
        <WipAlert />
      </DesignerStoreInitialiser>
    </DesignerTabManager>
  );
};

export default DemoLayout;
