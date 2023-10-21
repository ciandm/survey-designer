import { SurveyCard } from "@/components/survey-card";
import prisma from "@/prisma/client";

const Home = async () => {
  const surveys = await prisma.survey.findMany({
    include: {
      questions: true,
    },
  });

  return (
    <div className="container p-4">
      <h2 className="mb-6 mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Surveys
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {surveys.map((survey) => (
          <SurveyCard survey={survey} key={survey.id} />
        ))}
      </ul>
    </div>
  );
};

export default Home;

export const dynamic = "force-dynamic";
