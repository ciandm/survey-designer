import {Metadata} from 'next';
import {SurveyPreviewer} from '@/survey-designer/_components/survey-previewer';

const PreviewPage = async () => {
  return <SurveyPreviewer />;
};

export default PreviewPage;

export const metadata: Metadata = {
  title: 'Survey preview',
  description: 'Survey preview',
};
