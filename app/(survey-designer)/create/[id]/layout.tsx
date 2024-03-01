import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {tabConfig} from '@/config/designer';
import {UserAccountNav} from '@/dashboard/_components/user-account-nav';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {CreatorTabManager} from '@/survey-designer/_components/creator-tab-manager';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {DesignerStoreInitialiser} from '@/survey-designer/_components/designer-store-initiailiser';
import {PublishDialog} from '@/survey-designer/_components/publish-dialog';
import {SurveyActions} from '@/survey-designer/_components/survey-actions';
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
    <SurveyProvider schema={survey.schema} id={survey.id}>
      <DesignerStoreInitialiser survey={survey}>
        <CreatorTabManager tabs={tabs}>
          <PublishDialog>
            <div className="min-h-screen flex-col" vaul-drawer-wrapper="">
              <header className="sticky top-0 z-10 flex h-14 flex-1 items-center justify-between border-b bg-card px-4">
                <div className="flex space-x-2 text-sm font-medium text-muted-foreground">
                  <Link
                    href={getSiteUrl.dashboardPage()}
                    className="hover:text-primary"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">Survey editor</span>
                </div>
                <DesignerNavigation tabs={tabConfig} />
                <div className="flex items-center space-x-4">
                  <SurveyActions />
                  <UserAccountNav user={user} />
                </div>
              </header>
              {children}
            </div>
          </PublishDialog>
        </CreatorTabManager>
      </DesignerStoreInitialiser>
    </SurveyProvider>
  );
}
