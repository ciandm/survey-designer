import {SurveyDesigner} from '@/features/survey-designer/components/survey-designer';

const SurveyEditorPage = async ({params}: {params: {id: string}}) => {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex h-full min-h-0">
        <SurveyDesigner />
      </main>
    </div>
  );
};

export default SurveyEditorPage;

export const dynamic = 'force-dynamic';
