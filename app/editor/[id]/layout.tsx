import {notFound} from 'next/navigation';
import {SurveyProvider} from '@/components/survey-provider';
import {EditorHeader} from '@/features/survey-designer/components/editor-header';
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
      <SurveyProvider survey={parsedSurvey.data}>
        <SurveyDesignerInitialiser
          survey={{
            ...survey,
            schema: parsedSurvey.data,
          }}
        />
        <div className="flex h-screen min-h-0 grid-rows-[64px_1fr] flex-col overflow-hidden">
          <EditorHeader />
          <main className="flex max-h-[calc(100vh-64px)] overflow-y-auto border-t bg-muted">
            {children}
          </main>
        </div>
      </SurveyProvider>
    </>
  );
}
