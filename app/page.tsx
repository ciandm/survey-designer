import { SurveyCard } from '@/components/survey-card';
import prisma from '@/prisma/client';

const Home = async () => {
  const surveys = await prisma.survey.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return (
    <div className='container p-4'>
      <h2 className='mt-10 scroll-m-20 mb-6 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
        Surveys
      </h2>
      <ul className='grid md:grid-cols-3 lg:grid-cols-4 gap-4 grid-cols-1'>
        {surveys.map((survey) => (
          <SurveyCard survey={survey} key={survey.id} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
