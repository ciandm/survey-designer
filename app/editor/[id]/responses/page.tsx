import {Metadata} from 'next';
import {surveyResponsesSchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const ResponsesPage = async ({params}: {params: {id: string}}) => {
  const surveyResponses = await prisma.surveyResponses.findMany({
    where: {
      surveyId: params.id,
    },
  });

  const parsedResponses = surveyResponsesSchema.safeParse(surveyResponses);

  if (!parsedResponses.success) {
    throw new Error('Invalid survey responses');
  }

  return (
    <div className="grid w-full max-w-5xl grid-cols-3 gap-2 overflow-auto p-8">
      {parsedResponses.data.map((response) => (
        <div className="flex flex-col bg-card p-4" key={response.id}>
          {response.id}
          <span>Responses: {response.responses.length + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ResponsesPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Responses',
  description: 'Survey Responses',
};
