import {notFound} from 'next/navigation';
import {Survey} from '@/features/survey-tool/components/survey';
import {surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const SurveyEditorPage = async ({params}: {params: {id: string}}) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!survey) {
    return null;
  }

  if (!survey.is_published) {
    return <h1>This survey does not exist</h1>;
  }

  const schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex justify-center border-b p-4">
        {schema.data.title}
      </header>
      <Survey schema={schema.data} />
    </div>
  );
};

export default SurveyEditorPage;

export const dynamic = 'force-dynamic';
