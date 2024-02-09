import {Metadata} from 'next';
import {SurveyDesigner} from '@/features/survey-designer/components/survey-designer';

const DesignerPage = async ({params}: {params: {id: string}}) => {
  return (
    <div className="flex h-screen flex-col">
      <SurveyDesigner />
    </div>
  );
};

export default DesignerPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
