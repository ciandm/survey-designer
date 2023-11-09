import {
  useSurveyDesignerActions,
  useSurveyQuestions,
  useSurveyTitle,
} from '@/features/survey-designer/store/survey-designer';
import {QuestionForm} from '@/features/survey-tool/components/question-form';
import {ResponsesProvider} from '@/features/survey-tool/components/responses-provider';
import {SurveyShell} from '@/features/survey-tool/components/survey-shell';

export const SurveyPreviewer = () => {
  const surveyTitle = useSurveyTitle();
  const questions = useSurveyQuestions();
  const {updateMode} = useSurveyDesignerActions();

  return (
    <SurveyShell
      surveyTitle={surveyTitle}
      onBackClick={() => updateMode('edit')}
    >
      <ResponsesProvider questions={questions}>
        <QuestionForm />
      </ResponsesProvider>
    </SurveyShell>
  );
};
