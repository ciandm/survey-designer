import {SurveyPreviewer} from '@/survey-dashboard/_components/survey-previewer';

const PreviewPage = async () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex-1 flex-shrink-0 sm:py-6">
        <div className="container max-w-2xl">
          <SurveyPreviewer />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
