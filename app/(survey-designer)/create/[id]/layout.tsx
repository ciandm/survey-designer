import {notFound, redirect} from 'next/navigation';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {SurveyProvider} from '@/components/survey-provider';
import {tabConfig} from '@/config/designer';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {DesignerTabManager} from '@/survey-designer/_components/designer-tab-manager';
import {PublishDialog} from '@/survey-designer/_components/publish-dialog';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

const tabs = tabConfig.map((item) => item.tab);

export default async function SurveyDesignerLayout({
  children,
  params,
}: React.PropsWithChildren<{params: {id: string}}>) {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  const survey = await getUserSurvey(params.id);

  if (!survey) {
    notFound();
  }

  return (
    <SurveyProvider survey={survey}>
      <DesignerStoreInitialiser survey={survey}>
        <DesignerTabManager tabs={tabs}>
          <PublishDialog>
            <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
              <DesignerToolbar
                tabs={tabConfig}
                homeHref={getSiteUrl.dashboardPage()}
                user={user}
              />
              {children}
            </div>
          </PublishDialog>
        </DesignerTabManager>
      </DesignerStoreInitialiser>
    </SurveyProvider>
  );
}
