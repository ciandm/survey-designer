import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {SurveyCard} from '@/features/home/components/survey-card';
import {
  SurveyResponse,
  SurveySchema,
  surveySchema,
} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

type SurveysWithResponseCount = SurveyResponse['survey'] & {
  responseCount: number;
};

async function getHomeSurveys(): Promise<SurveysWithResponseCount[]> {
  const surveys = await prisma.survey.findMany({
    include: {
      SurveyResult: true,
    },
  });

  return surveys
    .map((survey) => {
      const parsedSchema = surveySchema.safeParse(survey.schema);
      if (!parsedSchema.success) {
        return null;
      }

      return {
        ...survey,
        responseCount: survey.SurveyResult.length,
        schema: parsedSchema.data,
      };
    })
    .filter(validateIsNotNull);
}

function validateIsNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const Home = async () => {
  const surveys = await getHomeSurveys();

  return (
    <div className="container p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight transition-colors first:mt-0">
          Surveys
        </h1>
        <Button>Create Survey</Button>
      </div>
      <Separator className="mb-6 mt-4" />
      <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(480px,1fr))] md:gap-4">
        {surveys.map((survey) => {
          return (
            <SurveyCard
              responsesCount={survey.responseCount}
              schema={survey.schema}
              survey={survey}
              key={survey.id}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Home;

export const dynamic = 'force-dynamic';
