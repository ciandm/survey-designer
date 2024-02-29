import {notFound, redirect} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';
import {DesignerProvider} from '@/survey-designer/_components/designer-provider';
import {PublishDialog} from '@/survey-designer/_components/publish-dialog';
import {Toolbar} from '@/survey-designer/_components/toolbar';
import {getUserSurvey} from '@/survey-designer/_lib/get-user-survey';

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {id: string};
}) {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  const survey = await getUserSurvey(params.id);

  if (!survey) {
    return notFound();
  }

  return (
    <>
      <SurveyProvider schema={survey.schema} id={survey.id}>
        <DesignerProvider survey={survey}>
          <PublishDialog>
            <div
              className="flex h-[calc(100vh-64px)] max-h-screen flex-col"
              vaul-drawer-wrapper=""
            >
              <div className="flex flex-shrink-0">
                <Toolbar />
              </div>
              <main className="relative h-full flex-1 overflow-hidden bg-muted">
                {children}
              </main>
            </div>
          </PublishDialog>
        </DesignerProvider>
      </SurveyProvider>
    </>
  );
}
