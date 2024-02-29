import {notFound} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {db} from '@/lib/db/survey';
import {DesignerProvider} from '@/survey-dashboard/_components/designer-provider';
import {Header} from '@/survey-dashboard/_components/header';
import {PublishDialog} from '@/survey-dashboard/_components/publish-dialog';

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {id: string};
}) {
  const survey = await db.getSurveyById(params.id);

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
                <Header />
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
