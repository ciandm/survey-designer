import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {SurveyList} from '@/dashboard/_components/survey-list';
import {getUserSurveys} from '@/dashboard/_lib/get-user-surveys';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/utils/hrefs';

const Home = async () => {
  const {session} = await getUser();

  if (!session) {
    return redirect(getSiteUrl.loginPage());
  }

  const surveys = await getUserSurveys();

  return (
    <div className="flex-1 bg-accent">
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
              <Link href={getSiteUrl.createPage()}>Create survey</Link>
            </Button>
          </div>
        </div>
        <SurveyList surveys={surveys} />
      </div>
    </div>
  );
};

export default Home;

export const dynamic = 'force-dynamic';
