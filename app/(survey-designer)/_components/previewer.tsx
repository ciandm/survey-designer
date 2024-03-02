'use client';

import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {SurveyForm} from '@/survey/_components/survey-form';
import {sortChoices} from '@/survey/_utils/question';
import {
  useSurveyId,
  useSurveyModel,
} from '@/survey-designer/_store/survey-designer-store';

export const Previewer = () => {
  const id = useSurveyId();
  const model = sortChoices(useSurveyModel());

  const hasNoQuestions = model.elements.length === 0;

  const title = !!model.title ? model.title : 'Untitled Survey';

  if (hasNoQuestions) {
    return (
      <SurveyShell>
        <SurveyShellAside title={title} description={model.description} />
        <SurveyShellMain>
          <div className="space-y-4 text-center">
            <h1 className="text-5xl">😭</h1>
            <p className="text-muted-foreground">
              There are no questions in this survey. Add questions to see a
              preview
            </p>
          </div>
        </SurveyShellMain>
      </SurveyShell>
    );
  }

  return (
    <SurveyShell>
      <SurveyShellAside title={title} description={model.description} />
      <SurveyShellMain>
        <SurveyForm shouldSubmitResults={false} model={model} surveyId={id} />
      </SurveyShellMain>
    </SurveyShell>
  );
};
