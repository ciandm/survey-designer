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

  return <h1>Published!</h1>;
};

export default SurveyEditorPage;

export const dynamic = 'force-dynamic';
