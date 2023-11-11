import {QuestionForm} from '@/features/survey-tool/components/question-form';
import {ResponsesProvider} from '@/features/survey-tool/components/responses-provider';
import {SurveyShell} from '@/features/survey-tool/components/survey-shell';
import {useDesignerModeActions} from '../store/designer-mode';
import {useSurveyDetails, useSurveyQuestions} from '../store/survey-designer';

export const SurveyPreviewer = () => {
  const {title} = useSurveyDetails();
  const questions = useSurveyQuestions();
  const {updateMode} = useDesignerModeActions();

  return (
    <SurveyShell surveyTitle={title} onBackClick={() => updateMode('edit')}>
      <ResponsesProvider questions={questions}>
        <QuestionForm />
      </ResponsesProvider>
    </SurveyShell>
  );
};
