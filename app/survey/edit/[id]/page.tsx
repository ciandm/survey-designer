import {notFound} from 'next/navigation';
import {SurveySchemaInitialiser} from '@/components/survey-schema-initiailiser';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {EditorFooter} from '@/features/survey-designer/components/editor-footer';
import {EditorHeader} from '@/features/survey-designer/components/editor-header';
import {EditorSection} from '@/features/survey-designer/components/editor-section';
import {QuestionEditor} from '@/features/survey-designer/components/question-editor';
import {QuestionsSidebar} from '@/features/survey-designer/components/questions-sidebar';
import {configurationSchema} from '@/lib/validations/question';
import prisma from '@/prisma/client';

const SurveyCreatorPage = async ({params}: {params: {id: string}}) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!survey) {
    console.log('here?');
    return notFound();
  }

  const schema = configurationSchema.safeParse(survey.schema);

  if (!schema.success) {
    console.log('here?');
    // return notFound();
  }

  return (
    <>
      <SurveySchemaInitialiser survey={survey} />
      <div className="flex h-screen flex-col">
        <main className="flex h-full min-h-0">
          <QuestionsSidebar />
          <div className="w-full flex-1">
            <EditorHeader />
            <div className="flex h-full">
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
