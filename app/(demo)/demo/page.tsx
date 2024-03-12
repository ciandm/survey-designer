'use client';

import {Suspense} from 'react';
import {demoTabConfig} from '@/config/designer';
import {Designer} from '@/survey-designer/_components/designer/designer';
import {DesignerTabItem} from '@/survey-designer/_components/designer-tab-manager';
import {Previewer} from '@/survey-designer/_components/previewer';

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
