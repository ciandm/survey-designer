import {SurveyPreviewer} from '@/features/survey-designer/components/survey-previewer';

const PreviewPage = async ({params}: {params: {id: string}}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex-1 flex-shrink-0 sm:py-12">
        <SurveyPreviewer />
      </div>
    </div>
  );
};

export default PreviewPage;
