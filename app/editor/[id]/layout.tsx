import {notFound} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {Header} from '@/features/survey-designer/components/header';
import {PublishDialog} from '@/features/survey-designer/components/publish-dialog';
import {SurveyDesignerInitialiser} from '@/features/survey-designer/components/survey-designer-initiailiser';
import {surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {id: string};
}) {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!survey) {
    return notFound();
  }

  const parsedSurvey = surveySchema.safeParse(survey.schema);

  if (!parsedSurvey.success) {
    return notFound();
  }

  return (
    <>
      <SurveyProvider schema={parsedSurvey.data} id={survey.id}>
        <SurveyDesignerInitialiser
          survey={{
            ...survey,
            schema: parsedSurvey.data,
          }}
        />
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
      </SurveyProvider>
    </>
  );
}
