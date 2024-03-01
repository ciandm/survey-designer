import {tabConfig} from '@/config/designer';
import {CreatorTabItem} from '@/survey-designer/_components/creator-tab-manager';
import {Designer} from '@/survey-designer/_components/designer';
import {Previewer} from '@/survey-designer/_components/previewer';

const tabs = tabConfig.map((item) => item.tab);

const SurveyCreatorPage = () => {
  return (
    <>
      {tabs.map((tab) => (
        <CreatorTabItem key={tab} tab={tab}>
          {tab === 'designer' && <Designer />}
          {tab === 'preview' && <Previewer />}
          {tab === 'responses' && <h1>Responses</h1>}
        </CreatorTabItem>
      ))}
    </>
  );
};

export default SurveyCreatorPage;
