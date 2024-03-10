import React from 'react';
import {WipAlert} from 'app/(landing-page)/_components/wip-alert';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {demoSurvey} from '@/config/demo';
import {demoTabConfig} from '@/config/designer';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {DesignerTabManager} from '@/survey-designer/_components/designer-tab-manager';
import {getSiteUrl} from '@/utils/hrefs';

const tabs = demoTabConfig.map(({tab}) => tab);

const DemoLayout = ({children}: React.PropsWithChildren) => {
  return (
    <DesignerStoreInitialiser survey={demoSurvey}>
      <DesignerTabManager tabs={tabs}>
        <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
          <DesignerToolbar
            tabs={demoTabConfig}
            homeHref={getSiteUrl.homePage()}
            title={demoSurvey.model.title}
          />
          {children}
        </div>
        <WipAlert />
      </DesignerTabManager>
    </DesignerStoreInitialiser>
  );
};

export default DemoLayout;
