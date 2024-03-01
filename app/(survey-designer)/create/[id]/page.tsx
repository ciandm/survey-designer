import {tabConfig} from '@/config/designer';
import {Designer} from '@/survey-designer/_components/designer';
import {DesignerTabItem} from '@/survey-designer/_components/designer-tab-manager';
import {Previewer} from '@/survey-designer/_components/previewer';
import {Responses} from '@/survey-designer/_components/responses';

const tabs = tabConfig.map((item) => item.tab);

const SurveyCreatorPage = ({params}: {params: {id: string}}) => {
  return (
    <>
      {tabs.map((tab) => (
        <DesignerTabItem key={tab} tab={tab}>
          {tab === 'designer' && <Designer />}
          {tab === 'preview' && <Previewer />}
          {tab === 'responses' && <Responses id={params.id} />}
        </DesignerTabItem>
      ))}
    </>
  );
};

export default SurveyCreatorPage;
