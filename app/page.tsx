import {SurveyCard} from '@/features/home/components/survey-card';
import {SurveyCardActions} from '@/features/home/components/survey-card-actions';
import {surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const Home = async () => {
  const surveys = await prisma.survey.findMany();

  return (
    <div className="container p-4">
      <h2 className="mb-6 mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Surveys
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {surveys.map((survey) => {
          const parsedSchema = surveySchema.safeParse(survey.schema);
          if (!parsedSchema.success) {
            return null;
          }
          const {data} = parsedSchema;

          return (
            <SurveyCard schema={data} key={survey.id}>
              <SurveyCardActions surveyId={survey.id} />
            </SurveyCard>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;

export const dynamic = 'force-dynamic';
