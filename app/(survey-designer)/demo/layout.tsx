import React from 'react';
import {WipAlert} from 'features/landing-page/components/wip-alert';
import {demoSurvey} from '@/config/demo';
import {demoTabConfig} from '@/config/designer';
import {DesignerStoreInitialiser} from '@/features/survey-designer/components/designer-store-initiailiser';
import {DesignerTabManager} from '@/features/survey-designer/components/designer-tab-manager';
import {DesignerToolbar} from '@/features/survey-designer/components/designer-toolbar';
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
