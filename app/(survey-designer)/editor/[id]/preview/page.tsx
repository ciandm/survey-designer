import {SurveyPreviewer} from '@/survey-designer/_components/survey-previewer';

const PreviewPage = async () => {
  return (
    <div className="sm:container sm:max-w-2xl sm:py-8">
      <SurveyPreviewer />
    </div>
  );
};

export default PreviewPage;
