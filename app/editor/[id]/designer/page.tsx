import {Metadata} from 'next';
import {BuildPanel} from '@/features/survey-designer/components/build-panel';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {SurveyDesigner} from '@/features/survey-designer/components/survey-designer';
import {QUESTION_TYPE} from '@/lib/constants/question';

QUESTION_TYPE;

const DesignerPage = async () => {
  return (
    <>
      <BuildPanel />
      <SurveyDesigner />
      <ConfigPanel />
    </>
  );
};

export default DesignerPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
