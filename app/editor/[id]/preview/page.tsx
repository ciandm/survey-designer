import {SurveyPreviewer} from '@/features/survey-designer/components/survey-previewer';

const PreviewPage = async ({params}: {params: {id: string}}) => {
  return <SurveyPreviewer />;
};

export default PreviewPage;
