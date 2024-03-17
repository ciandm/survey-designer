import {notFound, redirect} from 'next/navigation';
import {tabConfig} from '@/config/designer';
import {UserAccountNav} from '@/features/auth/components/user-account-nav';
import {DesignerStoreInitialiser} from '@/features/survey-designer/components/designer-store-initiailiser';
import {DesignerTabManager} from '@/features/survey-designer/components/designer-tab-manager';
import {DesignerToolbar} from '@/features/survey-designer/components/designer-toolbar/designer-toolbar';
import {SurveyActions} from '@/features/survey-designer/components/survey-actions/survey-actions';
import {getUserSurvey} from '@/features/survey-designer/lib/get-user-survey';
import {getUser} from '@/lib/auth';
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
    </DesignerStoreInitialiser>
  );
}
