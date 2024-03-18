import {Metadata} from 'next';
import {tabConfig} from '@/config/designer';
import {Designer} from '@/features/survey-designer/components/designer';
import {DesignerTabItem} from '@/features/survey-designer/components/designer-tab-manager';
import {Previewer} from '@/features/survey-designer/components/previewer';
import {Responses} from '@/features/survey-designer/components/responses';
import {getUserSurvey} from '@/features/survey-designer/lib/get-user-survey';

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
