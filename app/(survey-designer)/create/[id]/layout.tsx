import {notFound, redirect} from 'next/navigation';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {tabConfig} from '@/config/designer';
import {UserAccountNav} from '@/dashboard/_components/user-account-nav';
import {getUser} from '@/lib/auth';
import {DesignerDialogs} from '@/survey-designer/_components/designer-dialogs';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {DesignerTabManager} from '@/survey-designer/_components/designer-tab-manager';
import {SurveyActions} from '@/survey-designer/_components/survey-actions';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';
import {getSiteUrl} from '@/utils/hrefs';

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
            >
              <div className="ml-auto flex items-center space-x-4">
                <SurveyActions />
                {user && (
                  <UserAccountNav
                    user={{username: user?.username ?? ''}}
                    isOnDarkBg
                  />
                )}
              </div>
            </DesignerToolbar>
            {children}
          </div>
        </DesignerTabManager>
      </DesignerDialogs>
    </DesignerStoreInitialiser>
  );
}
