import {notFound} from 'next/navigation';
import {DesignerLinks} from '@/features/survey-designer/components/designer-links';
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
      <EditorHeader />
      <DesignerLinks />
      <>{children}</>
    </>
  );
}
