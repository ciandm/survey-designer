'use client';

import {Suspense} from 'react';
import {demoTabConfig} from '@/config/designer';
import {Designer} from '@/features/survey-designer/components/designer';
import {DesignerTabItem} from '@/features/survey-designer/components/designer-tab-manager';
import {Previewer} from '@/features/survey-designer/components/previewer';

const DemoPage = () => {
  return (
    <>
      {demoTabConfig.map(({tab}) => (
        <DesignerTabItem key={tab} tab={tab}>
          <Suspense>{tab === 'designer' && <Designer />}</Suspense>
          {tab === 'previewer' && <Previewer />}
        </DesignerTabItem>
      ))}
    </>
  );
};

export default DemoPage;
