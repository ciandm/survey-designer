import {notFound} from 'next/navigation';
import {tabConfig} from '@/config/designer';
import {Designer} from '@/survey-designer/_components/designer';
import {DesignerDialogs} from '@/survey-designer/_components/designer-dialogs';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {
  DesignerTabItem,
  DesignerTabManager,
} from '@/survey-designer/_components/designer-tab-manager';
import {Previewer} from '@/survey-designer/_components/previewer';
import {Responses} from '@/survey-designer/_components/responses';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

const tabs = tabConfig.map((item) => item.tab);

const SurveyCreatorPage = async ({params}: {params: {id: string}}) => {
  const survey = await getUserSurvey(params.id);

  if (!survey) {
    notFound();
  }

  return (
    <DesignerStoreInitialiser survey={survey}>
      <DesignerDialogs>
        <DesignerTabManager tabs={tabs}>
          {tabs.map((tab) => (
            <DesignerTabItem key={tab} tab={tab}>
              {tab === 'designer' && <Designer />}
              {tab === 'previewer' && <Previewer />}
              {tab === 'responses' && (
                <Responses id={params.id} survey={survey} />
              )}
            </DesignerTabItem>
          ))}
        </DesignerTabManager>
      </DesignerDialogs>
    </DesignerStoreInitialiser>
  );
};

export default SurveyCreatorPage;
