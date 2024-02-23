import {Metadata} from 'next';
import {BuildPanel} from '@/features/survey-designer/components/build-panel';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {SurveyDesigner} from '@/features/survey-designer/components/survey-designer';

const DesignerPage = async () => {
  return (
    <div className="flex h-full overflow-hidden">
      <BuildPanel />
      {/* <div className="overflow-y-auto"> */}
      <SurveyDesigner />
      {/* </div> */}
      <ConfigPanel />
    </div>
  );
};

export default DesignerPage;

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
