import {demoTabConfig} from '@/config/designer';
import {Designer} from '@/survey-designer/_components/designer';
import {DesignerTabItem} from '@/survey-designer/_components/designer-tab-manager';
import {Previewer} from '@/survey-designer/_components/previewer';

const DemoPage = () => {
  return (
    <>
      {demoTabConfig.map(({tab}) => (
        <DesignerTabItem key={tab} tab={tab}>
          {tab === 'designer' && <Designer />}
          {tab === 'preview' && <Previewer />}
        </DesignerTabItem>
      ))}
    </>
  );
};

export default DemoPage;
