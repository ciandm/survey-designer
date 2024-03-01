import {Metadata} from 'next';
import {Previewer} from '@/survey-designer/_components/previewer';

const PreviewPage = async () => {
  return <Previewer />;
};

export default PreviewPage;

export const metadata: Metadata = {
  title: 'Survey preview',
  description: 'Survey preview',
};
