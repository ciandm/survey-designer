import {notFound, redirect} from 'next/navigation';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {tabConfig} from '@/config/designer';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {DesignerDialogs} from '@/survey-designer/_components/designer-dialogs';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {DesignerTabManager} from '@/survey-designer/_components/designer-tab-manager';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

const tabs = tabConfig.map((item) => item.tab);

type SurveyDesignerLayoutProps = {
  params: {
    id: string;
  };
  children: React.ReactNode;
};

export default async function SurveyDesignerLayout({
  children,
  params,
}: SurveyDesignerLayoutProps) {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  const survey = await getUserSurvey(params.id);

  if (!survey) {
    notFound();
  }

  return (
    <DesignerStoreInitialiser survey={survey}>
      <DesignerDialogs>
        <DesignerTabManager tabs={tabs}>
          <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
            <DesignerToolbar
              tabs={tabConfig}
              homeHref={getSiteUrl.dashboardPage()}
              user={user}
            />
            {children}
          </div>
        </DesignerTabManager>
      </DesignerDialogs>
    </DesignerStoreInitialiser>
  );
}
