import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {UserAccountNav} from '@/dashboard/_components/user-account-nav';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {DesignerNavigation} from '@/survey-designer/_components/designer-navigation';
import {DesignerProvider} from '@/survey-designer/_components/designer-provider';
import {PublishDialog} from '@/survey-designer/_components/publish-dialog';
import {SurveyActions} from '@/survey-designer/_components/survey-actions';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

export default async function SurveyBuilderLayout({
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
      <DesignerProvider survey={survey}>
        <PublishDialog>
          <div className="flex h-screen flex-col" vaul-drawer-wrapper="">
            <div className="flex flex-shrink-0">
              <header className="flex h-14 flex-1 items-center justify-between border-b bg-card px-4">
                <div className="flex space-x-2 text-sm font-medium text-muted-foreground">
                  <Link
                    href={getSiteUrl.homePage()}
                    className="hover:text-primary"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">Survey editor</span>
                </div>
                <DesignerNavigation />
                <div className="flex items-center space-x-4">
                  <SurveyActions />
                  <UserAccountNav user={user} />
                </div>
              </header>
            </div>
            <main className="h-full flex-1 overflow-hidden bg-muted">
              {children}
            </main>
          </div>
        </PublishDialog>
      </DesignerProvider>
    </SurveyProvider>
  );
}
