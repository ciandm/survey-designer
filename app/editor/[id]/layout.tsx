import {notFound} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {DesignerProvider} from '@/features/survey-designer/components/designer-provider';
import {Header} from '@/features/survey-designer/components/header';
import {PublishDialog} from '@/features/survey-designer/components/publish-dialog';
import {db} from '@/lib/db/survey';

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
              className="flex h-screen max-h-screen flex-col"
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
