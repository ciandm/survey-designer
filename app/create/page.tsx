import {CreateForm} from '@/features/create/components/create-form';

const CreatePage = () => {
  return (
    <div className="min-h-screen bg-muted p-4 lg:px-0 lg:py-12">
      <div className="container max-w-5xl">
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
      </div>
    </div>
  );
};

export default CreatePage;
