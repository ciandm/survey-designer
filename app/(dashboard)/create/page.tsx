import {Suspense} from 'react';
import {redirect} from 'next/navigation';
import {CreateForm} from '@/features/dashboard/components/create-form';
import {PreviousSurveys} from '@/features/dashboard/components/previous-surveys';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/utils/hrefs';

const CreateSurveyPage = async () => {
  const {session} = await getUser();

  if (!session) {
    return redirect(getSiteUrl.loginPage());
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:px-0 md:py-12">
      <div className="w-full md:container md:max-w-2xl">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">
          Create a new survey
        </h1>
        <CreateForm />
        <div className="my-8 flex w-full items-center gap-2">
          <div className="flex-1 border-t" />
          <span className="text-sm font-medium capitalize">OR</span>
          <div className="flex-1 border-t" />
        </div>
        <h2 className="mb-4 text-base font-medium">Copy a previous survey</h2>
        <Suspense fallback={<PreviousSurveys.Skeleton />}>
          <PreviousSurveys />
        </Suspense>
      </div>
    </div>
  );
};

export default CreateSurveyPage;
