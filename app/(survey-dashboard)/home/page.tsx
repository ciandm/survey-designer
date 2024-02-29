import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {getUser} from '@/lib/auth';
import {SurveyCard} from '@/survey-dashboard/_components/survey-card';
import {getUserSurveys} from '../_lib/get-user-surveys';

const Home = async () => {
  const {session} = await getUser();

  if (!session) {
    return redirect('/login');
  }

  const surveys = await getUserSurveys();

  return (
    <div className="px-4 py-5 md:container md:py-8 lg:py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight transition-colors first:mt-0">
          Your surveys
        </h1>
        <Button asChild>
          <Link href="/create">Create survey</Link>
        </Button>
      </div>
      <Separator className="mb-6 mt-4" />
      <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(480px,1fr))] md:gap-4">
        {surveys.map((survey) => {
          return (
            <SurveyCard
              responsesCount={survey.SurveyResult.length}
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
