import {Metadata} from 'next';
import {DeleteResponsesButton} from '@/features/survey-designer/components/delete-responses-button';
import {Response} from '@/features/survey-designer/components/response';
import prisma from '@/prisma/client';

const ResponsesPage = async ({params}: {params: {id: string}}) => {
  const surveyResults = await prisma.surveyResult.findMany({
    where: {
      surveyId: params.id,
    },
  });

  if (surveyResults.length === 0) {
    return <div>No responses found</div>;
  }

  return (
    <div className="w-full overflow-auto p-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start">
        <DeleteResponsesButton surveyId={params.id} />
        <div className="mt-4 flex w-full flex-col gap-4">
          {surveyResults.map((surveyResult) => (
            <Response key={surveyResult.id} surveyResult={surveyResult} />
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
