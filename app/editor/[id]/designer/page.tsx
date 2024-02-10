import {Metadata} from 'next';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {SurveyDesigner} from '@/features/survey-designer/components/survey-designer';

const DesignerPage = async () => {
  return (
    <div className="flex h-screen">
      <div className="bg-white">Add questions from here</div>
      <div className="flex flex-1">
        <SurveyDesigner />
        <ConfigPanel />
      </div>
    </div>
  );
};

export default DesignerPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
