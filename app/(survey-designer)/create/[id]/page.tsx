import {Metadata} from 'next';
import {tabConfig} from '@/config/designer';
import {Designer} from '@/survey-designer/_components/designer/designer';
import {DesignerTabItem} from '@/survey-designer/_components/designer-tab-manager';
import {Previewer} from '@/survey-designer/_components/previewer';
import {Responses} from '@/survey-designer/_components/responses';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

const tabs = tabConfig.map((item) => item.tab);

const SurveyCreatorPage = async ({params}: {params: {id: string}}) => {
  const survey = await getUserSurvey(params.id);

  if (!survey) return null;

  return (
    <>
      {tabs.map((tab) => (
        <DesignerTabItem key={tab} tab={tab}>
          {tab === 'designer' && <Designer />}
          {tab === 'previewer' && <Previewer />}
          {tab === 'responses' && <Responses id={params.id} survey={survey} />}
        </DesignerTabItem>
      ))}
    </>
  );
};

export default SurveyCreatorPage;

export const metadata: Metadata = {
  title: 'Create a survey',
  description: 'Create a survey',
};
