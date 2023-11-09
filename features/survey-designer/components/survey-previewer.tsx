import {QuestionForm} from '@/features/survey-tool/components/question-form';
import {ResponsesProvider} from '@/features/survey-tool/components/responses-provider';
import {SurveyShell} from '@/features/survey-tool/components/survey-shell';
import {useDesignerModeActions} from '../store/designer-mode';
import {useQuestions} from '../store/questions';
import {useSurveyDetails} from '../store/survey-details';

export const SurveyPreviewer = () => {
  const {title} = useSurveyDetails();
  const questions = useQuestions();
  const {updateMode} = useDesignerModeActions();

  return (
    <SurveyShell surveyTitle={title} onBackClick={() => updateMode('edit')}>
      <ResponsesProvider questions={questions}>
        <QuestionForm />
      </ResponsesProvider>
    </SurveyShell>
  );
};
