import {notFound} from 'next/navigation';
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
      <SurveySchemaInitialiser schema={schema.data} />
      {children}
    </>
  );
}
