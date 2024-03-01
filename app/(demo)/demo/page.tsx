import {demoTabConfig} from '@/config/designer';
import {CreatorTabItem} from '@/survey-designer/_components/creator-tab-manager';
import {Designer} from '@/survey-designer/_components/designer';
import {Previewer} from '@/survey-designer/_components/previewer';

const DemoPage = () => {
  return (
    <>
      {demoTabConfig.map(({tab}) => (
        <CreatorTabItem key={tab} tab={tab}>
          {tab === 'designer' && <Designer />}
          {tab === 'preview' && <Previewer />}
        </CreatorTabItem>
      ))}
    </>
  );
};

export default DemoPage;
