import {notFound} from 'next/navigation';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {EditorFooter} from '@/features/survey-designer/components/editor-footer';
import {EditorHeader} from '@/features/survey-designer/components/editor-header';
import {EditorSection} from '@/features/survey-designer/components/editor-section';
import {QuestionEditor} from '@/features/survey-designer/components/question-editor';
import {QuestionsSidebar} from '@/features/survey-designer/components/questions-sidebar';
import {SurveySchemaInitialiser} from '@/features/survey-designer/components/survey-schema-initiailiser';
import {configurationSchema} from '@/lib/validations/question';
import prisma from '@/prisma/client';

const SurveyCreatorPage = async ({params}: {params: {id: string}}) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!survey) {
    return notFound();
  }

  const schema = configurationSchema.safeParse(survey.schema);

  if (!schema.success) {
    return notFound();
  }

  return (
    <>
      <SurveySchemaInitialiser survey={survey} />
      <div className="flex h-screen flex-col">
        <main className="flex h-full min-h-0">
          <QuestionsSidebar />
          <div className="flex w-full flex-1 flex-col">
            <EditorHeader />
            <div className="flex h-full flex-1 overflow-hidden">
              <EditorSection>
                <QuestionEditor />
                <EditorFooter />
              </EditorSection>
              <ConfigPanel />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SurveyCreatorPage;
