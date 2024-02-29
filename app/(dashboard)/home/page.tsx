import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {SurveyList} from '@/dashboard/_components/survey-list';
import {getUserSurveys} from '@/dashboard/_lib/get-user-surveys';
import {getUser} from '@/lib/auth';

const Home = async () => {
  const {session} = await getUser();

  if (!session) {
    return redirect('/login');
  }

  const surveys = await getUserSurveys();

  return (
    <div className="px-4 py-5 md:container md:py-8">
      <div className="flex items-center justify-between">
        <div className="mb-8 flex w-full items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight transition-colors first:mt-0">
              Your surveys
            </h1>
            <p className="text-muted-foreground">
              Create and manage your surveys
            </p>
          </div>
          <Button asChild>
            <Link href="/create">Create survey</Link>
          </Button>
        </div>
      </div>
      <SurveyList surveys={surveys} />
    </div>
  );
};

export default Home;

export const dynamic = 'force-dynamic';
