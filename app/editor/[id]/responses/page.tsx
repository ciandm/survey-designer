import {Metadata} from 'next';
import {DeleteResponsesButton} from '@/features/survey-designer/components/delete-responses-button';
import {Response} from '@/features/survey-designer/components/response';
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

  if (parsedResponses.data.length === 0) {
    return <div>No responses :(</div>;
  }

  return (
    <div className="w-full overflow-auto p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start">
        <DeleteResponsesButton surveyId={params.id} />
        <div className="mt-4 flex w-full flex-col gap-4">
          {parsedResponses.data.map((response) => (
            <Response key={response.id} response={response} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Responses',
  description: 'Survey Responses',
};
