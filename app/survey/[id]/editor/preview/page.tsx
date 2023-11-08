import {v4 as uuidv4} from 'uuid';
import {QuestionCard} from '@/features/question/components/question-card';
import {QuestionChoices} from '@/features/question/components/question-choices';
import {QuestionWording} from '@/features/question/components/question-wording';
import {PreviewHeader} from '@/features/survey-preview/components/preview-header';

const SurveyEditorPreviewPage = () => {
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

  return (
    <div className="flex h-screen flex-col border-b bg-background">
      <PreviewHeader surveyTitle={survey.name} />
      <main className="flex flex-1 items-center justify-center bg-primary-foreground py-20">
        <div className="flex h-full w-full max-w-5xl flex-1">
          <QuestionCard
            view="live"
            totalQuestions={survey.schema.fields.length}
            questionNumber={1}
            question={survey.schema.fields[0] as any}
          >
            <QuestionWording />
            <QuestionChoices />
          </QuestionCard>
        </div>
      </main>
    </div>
  );
};

export default SurveyEditorPreviewPage;
