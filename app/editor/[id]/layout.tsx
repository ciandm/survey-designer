import {notFound} from 'next/navigation';
import {EditorHeader} from '@/features/survey-designer/components/editor-header';
import {SurveySchemaInitialiser} from '@/features/survey-designer/components/survey-schema-initiailiser';
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

  const schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return notFound();
  }

  return (
    <>
      <SurveySchemaInitialiser
        survey={{
          ...survey,
          schema: schema.data,
        }}
      />
      <div className="grid h-screen min-h-0 grid-rows-[60px_1fr] overflow-hidden">
        <EditorHeader />
        <main className="flex max-h-[calc(100vh-64px)] border-t bg-muted">
          <div className="w-12 bg-primary"></div>
          {children}
        </main>
      </div>
    </>
  );
}
