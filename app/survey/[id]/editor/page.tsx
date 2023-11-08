import {notFound} from 'next/navigation';
import {v4 as uuidv4} from 'uuid';
import {ConfigPanel} from '@/features/survey-designer/components/config-panel';
import {EditorFooter} from '@/features/survey-designer/components/editor-footer';
import {EditorHeader} from '@/features/survey-designer/components/editor-header';
import {EditorSection} from '@/features/survey-designer/components/editor-section';
import {QuestionEditor} from '@/features/survey-designer/components/question-editor';
import {QuestionsSidebar} from '@/features/survey-designer/components/questions-sidebar';
import {SurveySchemaInitialiser} from '@/features/survey-designer/components/survey-schema-initiailiser';
import {configurationSchema} from '@/lib/validations/question';
import prisma from '@/prisma/client';

const SurveyEditorPage = async ({
  searchParams,
}: {
  params: {id: string};
  searchParams: {question: string};
}) => {
  // const survey = await prisma.survey.findUnique({
  //   where: {
  //     id: params.id,
  //   },
  // });

  const survey = {
    id: '3a6ab3c3-6e91-4372-8e7a-7513124f7cc5',
    name: 'Customer Feedback Survey',
    schema: {
      id: '3a6ab3c3-6e91-4372-8e7a-7513124f7cc5',
      name: 'Customer Feedback Survey',
      fields: [
        {
          id: '384609ab-8e0d-476e-9133-549d1fb38de1',
          ref: uuidv4(),
          text: 'What is your name?',
          type: 'SHORT_TEXT',
          properties: {placeholder: 'Enter your name'},
          validations: {},
        },
        {
          id: '6dabce75-8f8e-4a99-b59f-3d0ed947c3c5',
          ref: uuidv4(),
          text: 'What is your email address?',
          type: 'SHORT_TEXT',
          properties: {placeholder: 'Enter your email'},
          validations: {},
        },
        {
          id: 'dabfb6d4-7c81-45d9-aa3f-4a9e0a62a8e5',
          ref: uuidv4(),
          text: 'How satisfied are you with our service?',
          type: 'SHORT_TEXT',
          properties: {placeholder: 'Enter your satisfaction level (1-10)'},
          validations: {},
        },
        {
          id: 'f0f0b8a1-47ad-4c4d-9bde-3e72a5f6f93b',
          ref: uuidv4(),
          text: 'What suggestions do you have for improvement?',
          type: 'SHORT_TEXT',
          properties: {placeholder: 'Enter your suggestions'},
          validations: {},
        },
        {
          id: 'abaf2ca6-5a5b-4cd1-9402-49f2c7a3c4c4',
          ref: uuidv4(),
          text: 'How did you hear about our company?',
          type: 'SHORT_TEXT',
          properties: {placeholder: 'Enter your source'},
          validations: {},
        },
      ],
    },
  };

  if (!survey) {
    return notFound();
  }

  const schema = configurationSchema.safeParse(survey.schema);

  if (!schema.success) {
    return notFound();
  }

  return (
    <>
      {/* <SurveySchemaInitialiser survey={survey} /> */}
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

export default SurveyEditorPage;
