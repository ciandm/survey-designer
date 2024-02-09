import {Metadata} from 'next';
import {surveyResponsesSchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const ResponsesPage = async ({params}: {params: {id: string}}) => {
  const surveyResponses = await prisma.surveyResponse.findMany({
    where: {
      surveyId: params.id,
    },
  });

  const parsedAnswers = surveyResponsesSchema.safeParse(surveyResponses);

  if (!parsedAnswers.success) {
    throw new Error('Invalid survey responses');
  }

  return (
    <div className="flex h-screen flex-col">
      <pre>{JSON.stringify(parsedAnswers, null, 2)}</pre>
    </div>
  );
};

export default ResponsesPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Responses',
  description: 'Survey Responses',
};
